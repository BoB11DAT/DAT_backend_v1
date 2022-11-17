import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ReceiptEntity, ReceiptRegistrationEntity } from "./receipt.entity";
import { GetReceiptRegistration } from "./receipt.interface";
import { ApplyingJudgeEntity } from "../applying/applying.entity";
import { JudgeEntity } from "../judge.entity";

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private readonly receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(ReceiptRegistrationEntity)
    private readonly receiptRegistrationRepository: Repository<ReceiptRegistrationEntity>,
    @InjectRepository(ApplyingJudgeEntity)
    private readonly applyingJudgeRepository: Repository<ApplyingJudgeEntity>,
    @InjectRepository(JudgeEntity)
    private readonly judgeRepository: Repository<JudgeEntity>,
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

  async createReceipt(receipt: ReceiptEntity): Promise<ReceiptEntity> {
    const receiptCreated = this.receiptRepository.create(receipt);
    return await this.receiptRepository.save(receiptCreated);
  }

  async getReceiptRegistration(
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

  async receiptApplying(
    user_uuid: string,
    receipt_registration_number: string,
  ) {
    const receiptRegistration =
      await this.receiptRegistrationRepository.findOne({
        where: { user_uuid, receipt_registration_number },
      });
    if (receiptRegistration && !receiptRegistration.receipt_registration_open) {
      const randomJudges = await this.judgeRepository
        .createQueryBuilder("judge")
        .select("judge.judge_id")
        .orderBy("RAND()")
        .take(70)
        .getMany();
      randomJudges.map(async (judge, i) => {
        const applyingJudge = this.applyingJudgeRepository.create({
          user_uuid,
          judge_id: judge.judge_id,
          receipt_registration_number,
          applying_judge_number: i,
        });
        await this.applyingJudgeRepository.save(applyingJudge);
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
}
/*여기서 응시 시작할 때 문제 목록중에 카테고리별로 뽑아서 번호 부여하고 applying_judges에
넣고 foreach돌려서 applying_answers에 applying_judge_id가 들어간 칼럼 만들어야함*/
