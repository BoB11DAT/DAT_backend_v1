import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import {
  ReceiptEntity,
  ReceiptRegistrationEntity,
  ReceiptJudgeEntity,
} from "./receipt.entity";
import { GetReceiptRegistration } from "./receipt.interface";
import { ApplyingAnswerEntity } from "../applying/applying.entity";
import { JudgeEntity } from "../judge.entity";

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private readonly receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(ReceiptRegistrationEntity)
    private readonly receiptRegistrationRepository: Repository<ReceiptRegistrationEntity>,
    @InjectRepository(ReceiptJudgeEntity)
    private readonly receiptJudgeRepository: Repository<ReceiptJudgeEntity>,
    @InjectRepository(JudgeEntity)
    private readonly judgeRepository: Repository<JudgeEntity>,
    @InjectRepository(ApplyingAnswerEntity)
    private readonly applyingAnswerRepository: Repository<ApplyingAnswerEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  findAll(): Promise<ReceiptEntity[]> {
    return this.receiptRepository.find();
  }

  getUUIDFromReq(req: Request): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async createReceipt(receiptData: ReceiptEntity): Promise<ReceiptEntity> {
    const receiptCreated = this.receiptRepository.create(receiptData);
    const receipt = await this.receiptRepository.save(receiptCreated);
    const randomJudges = await this.judgeRepository
      .createQueryBuilder("judge")
      .select("judge.judge_id")
      .orderBy("RAND()")
      .orderBy("judge.judge_category", "ASC")
      .take(70)
      .getMany();
    randomJudges.map(async (judge, i) => {
      const receiptJudge = this.receiptJudgeRepository.create({
        judge_id: judge.judge_id,
        receipt_id: receiptCreated.receipt_id,
        receipt_judge_number: i + 1,
      });
      await this.receiptJudgeRepository.save(receiptJudge);
    });
    return receipt;
  }

  async getReceiptRegistration(
    user_uuid: string,
  ): Promise<GetReceiptRegistration[]> {
    const receiptRegistrations = await this.receiptRegistrationRepository.find({
      where: { user_uuid },
    });
    let receiptRegistrationWithRound: GetReceiptRegistration[] = [];
    receiptRegistrationWithRound = await Promise.all(
      receiptRegistrations.map(async (receiptRegistration) => {
        const receipt = await this.receiptRepository.findOne({
          where: { receipt_id: receiptRegistration.receipt_id },
        });
        return {
          ...receiptRegistration,
          receipt_round: receipt.receipt_round,
        };
      }),
    );
    // sort by receipt_registration_end boolean value
    receiptRegistrationWithRound.sort((a, b) => {
      if (a.receipt_registration_end > b.receipt_registration_end) return 1;
      if (a.receipt_registration_end < b.receipt_registration_end) return -1;
      return 0;
    });
    return receiptRegistrationWithRound;
  }

  async getReceiptRegistrationExceptOpened(
    user_uuid: string,
  ): Promise<GetReceiptRegistration[]> {
    const receiptRegistrations = await this.receiptRegistrationRepository.find({
      where: { user_uuid },
    });
    // add receipt_round in receiptRegistration
    let receiptRegistrationWithRound: GetReceiptRegistration[] = [];
    receiptRegistrationWithRound = await Promise.all(
      receiptRegistrations.map(async (receiptRegistration) => {
        const receipt = await this.receiptRepository.findOne({
          where: { receipt_id: receiptRegistration.receipt_id },
        });
        return {
          ...receiptRegistration,
          receipt_round: receipt.receipt_round,
        };
      }),
    );
    // delete if receipt_registration_open is true or receipt_available_end_date is past
    receiptRegistrationWithRound = receiptRegistrationWithRound.filter(
      (receiptRegistration) => {
        const receipt_available_end_date = new Date(
          receiptRegistration.receipt_available_end_date,
        );
        receipt_available_end_date.setDate(
          receipt_available_end_date.getDate() + 1,
        );
        const now = new Date();
        if (
          receiptRegistration.receipt_registration_open ||
          receipt_available_end_date < now
        ) {
          return false;
        }
        return true;
      },
    );
    return receiptRegistrationWithRound;
  }

  async createReceiptRegistration(
    user_uuid: string,
    receiptRegistrationRound: string,
  ): Promise<ReceiptRegistrationEntity> {
    const receipt = await this.receiptRepository.findOne({
      where: { receipt_round: receiptRegistrationRound },
    });
    const receiptId = receipt.receipt_id;
    const lastRegistrationNumber =
      await this.receiptRegistrationRepository.findOne({
        where: { receipt_id: receiptId },
        order: { receipt_registration_number: "DESC" },
      });
    const receipt_registration_number =
      receiptRegistrationRound.replace("P", "D") +
      "-" +
      (lastRegistrationNumber
        ? (
            parseInt(
              lastRegistrationNumber.receipt_registration_number.substring(11),
            ) + 1
          )
            .toString()
            .padStart(4, "0")
        : "0001");
    const receipt_available_end_date = new Date(
      new Date().getFullYear(),
      receipt.receipt_end_date.getMonth() + 1,
      0,
    );
    receipt_available_end_date.setHours(0, 0, 0, 0);
    const receipt_available_start_date = new Date();
    receipt_available_start_date.setDate(
      receipt_available_end_date.getDate() - 15,
    );
    const receiptRegistrationCreated =
      this.receiptRegistrationRepository.create({
        receipt_registration_number,
        receipt_id: receiptId,
        user_uuid,
        receipt_available_start_date,
        receipt_available_end_date,
      });
    const receiptRegistration = await this.receiptRegistrationRepository.save(
      receiptRegistrationCreated,
    );
    return receiptRegistration;
  }

  async getRound(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<string> {
    const reg_num = /^D\d{2}-\d{4}-\d{1}-\d{4}$/;
    if (!reg_num.test(receipt_registration_number)) {
      throw new HttpException(
        "receipt_registration_number is not valid",
        HttpStatus.BAD_REQUEST,
      );
    }
    const receiptRegistration =
      await this.receiptRegistrationRepository.findOne({
        where: {
          user_uuid,
          receipt_registration_number,
        },
      });
    const receipt = await this.receiptRepository.findOne({
      where: { receipt_id: receiptRegistration.receipt_id },
    });
    return receipt.receipt_round;
  }

  async receiptApplying(
    user_uuid: string,
    receipt_registration_number: string,
  ) {
    const receiptRegistration =
      await this.receiptRegistrationRepository.findOne({
        where: { user_uuid, receipt_registration_number },
      });
    if (
      receiptRegistration &&
      !receiptRegistration.receipt_registration_open &&
      !receiptRegistration.receipt_registration_end
    ) {
      const receiptJudges = await this.receiptJudgeRepository.find({
        where: { receipt_id: receiptRegistration.receipt_id },
      });
      receiptJudges.map(async (judge, i) => {
        const applyingAnswer = this.applyingAnswerRepository.create({
          user_uuid,
          receipt_registration_number,
          judge_id: judge.judge_id,
          receipt_judge_id: judge.receipt_judge_id,
          receipt_judge_number: judge.receipt_judge_number,
        });
        await this.applyingAnswerRepository.save(applyingAnswer);
      });
      const receiptRegistrationNumber = this.jwtService.sign(
        { receipt_registration_number },
        {
          secret: this.config.get(`RECEIPT_NUMBER_SECRET`),
          expiresIn: this.config.get(`RECEIPT_NUMBER_EXPIRES_IN`),
        },
      );
      this.receiptRegistrationRepository.update(
        { receipt_registration_number, user_uuid },
        {
          receipt_registration_open: true,
          receipt_number_cookie: receiptRegistrationNumber,
        },
      );
      return { receiptRegistrationNumber };
    } else {
      return null;
    }
  }

  async continueApplying(
    user_uuid: string,
    receipt_registration_number: string,
  ) {
    const receiptRegistration =
      await this.receiptRegistrationRepository.findOne({
        where: { user_uuid, receipt_registration_number },
      });
    if (
      receiptRegistration &&
      receiptRegistration.receipt_registration_open &&
      !receiptRegistration.receipt_registration_end
    ) {
      const receiptRegistrationNumber = this.jwtService.sign(
        { receipt_registration_number },
        {
          secret: this.config.get(`RECEIPT_NUMBER_SECRET`),
          expiresIn: this.config.get(`RECEIPT_NUMBER_EXPIRES_IN`),
        },
      );
      this.receiptRegistrationRepository.update(
        { receipt_registration_number, user_uuid },
        {
          receipt_number_cookie: receiptRegistrationNumber,
        },
      );
      return { receiptRegistrationNumber };
    } else {
      return null;
    }
  }
}
/*여기서 응시 시작할 때 문제 목록중에 카테고리별로 뽑아서 번호 부여하고 applying_judges에
넣고 foreach돌려서 applying_answers에 applying_judge_id가 들어간 칼럼 만들어야함*/
