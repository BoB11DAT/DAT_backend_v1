import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, UpdateResult } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ApplyingAnswerEntity } from "./applying.entity";
import { JudgeEntity } from "../judge.entity";
import { Judge } from "./applying.interface";
import {
  ReceiptEntity,
  ReceiptRegistrationEntity,
  ReceiptJudgeEntity,
} from "../receipt/receipt.entity";
import { ResultEntity, ResultAnswerEntity } from "../result/result.entity";
import { ReportEntity, ReportAnswerEntity } from "../report/report.entity";
import { ReceiptRegistrationNumber } from "../receipt/receipt.interface";

@Injectable()
export class ApplyingService {
  constructor(
    @InjectRepository(ReceiptJudgeEntity)
    private readonly receiptJudgeRepository: Repository<ReceiptJudgeEntity>,
    @InjectRepository(ApplyingAnswerEntity)
    private readonly applyingAnswerRepository: Repository<ApplyingAnswerEntity>,
    @InjectRepository(JudgeEntity)
    private readonly judgeRepository: Repository<JudgeEntity>,
    @InjectRepository(ReceiptRegistrationEntity)
    private readonly receiptRegistrationRepository: Repository<ReceiptRegistrationEntity>,
    @InjectRepository(ReceiptEntity)
    private readonly receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(ResultEntity)
    private readonly resultRepository: Repository<ResultEntity>,
    @InjectRepository(ResultAnswerEntity)
    private readonly resultAnswerRepository: Repository<ResultAnswerEntity>,
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    @InjectRepository(ReportAnswerEntity)
    private readonly reportAnswerRepository: Repository<ReportAnswerEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  async receiptNumberMatch(
    receiptNumber: string,
    receiptNumberToken: string,
  ): Promise<boolean> {
    const receiptRegistration =
      await this.receiptRegistrationRepository.findOne({
        where: { receipt_registration_number: receiptNumber },
        select: ["receipt_number_cookie"],
      });
    if (receiptRegistration?.receipt_number_cookie === receiptNumberToken) {
      return true;
    }
    return false;
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

  async findAll(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<Judge[]> {
    const receiptRound = await this.getRound(
      user_uuid,
      receipt_registration_number,
    );
    const receiptId = (
      await this.receiptRepository.findOne({
        where: { receipt_round: receiptRound },
      })
    ).receipt_id;
    const applyingJudges = await this.receiptJudgeRepository.find({
      where: { receipt_id: receiptId },
      order: { receipt_judge_number: "ASC" },
    });
    const judges = applyingJudges.map(async (applyingJudge) => {
      const judgeOrigin = await this.judgeRepository.findOne({
        where: { judge_id: applyingJudge.judge_id },
        select: ["judge_category", "judge_content"],
      });
      return {
        ...applyingJudge,
        judge_category: judgeOrigin.judge_category,
        judge_content: judgeOrigin.judge_content,
      };
    });
    return Promise.all(judges);
  } //?????? ?????????????????? ?????? ?????? ????????? ???????????? ????????????????????? ?????????????????? ?????? ?????? ????????? ???????????????
  //?????? foreach??? ??????????????? ????????? ?????? ????????? ??????. ????????? join?????? judge_id???????????? ????????? ?????? ???????????? ???

  async findAllAnswer(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<ApplyingAnswerEntity[]> {
    return await this.applyingAnswerRepository.find({
      where: { user_uuid, receipt_registration_number },
    });
  }

  getUUIDFromReq(req: Request): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  getReceiptNumberFromReq(req: Request): string {
    return this.jwtService.verify(req.cookies.receiptRegistrationNumber, {
      secret: this.config.get("RECEIPT_NUMBER_SECRET"),
    }).receipt_registration_number;
  }

  async applyingAnswer(
    user_uuid: string,
    receipt_registration_number: string,
    receipt_judge_number: number,
    applying_answer: string,
  ): Promise<UpdateResult> {
    return await this.applyingAnswerRepository.update(
      {
        user_uuid,
        receipt_registration_number,
        receipt_judge_number,
      },
      {
        applying_answer,
      },
    );
  }

  async applyingVector(
    user_uuid: string,
    receipt_registration_number: string,
    receipt_judge_number: number,
    applying_answer_vector: number,
  ): Promise<UpdateResult> {
    const vector = applying_answer_vector ? applying_answer_vector : null;
    return await this.applyingAnswerRepository.update(
      {
        user_uuid,
        receipt_registration_number,
        receipt_judge_number,
      },
      {
        applying_answer_vector: vector,
      },
    );
  }

  //?????????
  async setReport(
    receipt_id: number,
    receipt_registration_number: string,
  ): Promise<any> {
    let reportEntity = await this.reportRepository.findOne({
      where: { receipt_id },
    });
    if (!reportEntity) {
      reportEntity = this.reportRepository.create();
      reportEntity.receipt_id = receipt_id;
      reportEntity = await this.reportRepository.save(reportEntity);
    }
    reportEntity.receipt_participants += 1;
    let report = await this.reportAnswerRepository.findOne({
      where: {
        report_id: reportEntity.report_id,
        reciept_judge_number: 1,
      },
    });
    if (!report) {
      for (let i = 0; i < 70; i++) {
        report = this.reportAnswerRepository.create();
        report.report_id = reportEntity.report_id;
        report.reciept_judge_number = i + 1;
        await this.reportAnswerRepository.save(report);
      }
    }
    const result = await this.resultRepository.findOne({
      where: { receipt_registration_number },
    });
    // set correct answer rate
    const resultAnswers = await this.resultAnswerRepository.find({
      where: {
        receipt_registration_number: result.receipt_registration_number,
      },
    });
    await this.reportRepository.update(
      { report_id: reportEntity.report_id },
      reportEntity,
    );
    resultAnswers.forEach(async (resultAnswer) => {
      if (resultAnswer.result_answer_correct) {
        const reportAnswer = await this.reportAnswerRepository.findOne({
          where: {
            report_id: reportEntity.report_id,
            reciept_judge_number: resultAnswer.receipt_judge_number,
          },
        });
        reportAnswer.report_correct_answer_count += 1;
        await this.reportAnswerRepository.update(
          reportAnswer.report_answer_id,
          reportAnswer,
        );
      }
    });
    return;
  }
  //?????????

  async applyingEnd(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<UpdateResult> {
    if (
      !(
        await this.receiptRegistrationRepository.findOne({
          where: { user_uuid, receipt_registration_number },
          select: ["receipt_registration_end"],
        })
      ).receipt_registration_end
    ) {
      const applyingAnswers = await this.applyingAnswerRepository.find({
        where: { user_uuid, receipt_registration_number },
      });
      const receipt_id = (
        await this.receiptRegistrationRepository.findOne({
          where: { user_uuid, receipt_registration_number },
          select: ["receipt_id"],
        })
      ).receipt_id;
      await this.resultRepository.insert({
        user_uuid,
        receipt_registration_number,
        receipt_id,
      });
      applyingAnswers.forEach(async (applyingAnswer) => {
        const judge = await this.judgeRepository.findOne({
          where: { judge_id: applyingAnswer.judge_id },
          select: ["judge_answer"],
        });
        const checkNull = (str: string) => {
          if (str === null) {
            return "";
          } else {
            return str;
          }
        };
        const resultAnswer = this.resultAnswerRepository.create({
          user_uuid,
          receipt_registration_number,
          judge_id: applyingAnswer.judge_id,
          applying_answer_id: applyingAnswer.applying_answer_id,
          receipt_judge_number: applyingAnswer.receipt_judge_number,
          result_answer_vector: applyingAnswer.applying_answer_vector,
          result_answer_correct:
            checkNull(applyingAnswer.applying_answer)
              .toLowerCase()
              .replace(/\\/g, "/") ===
            judge.judge_answer.toLowerCase().replace(/\\/g, "/"),
        });
        await this.resultAnswerRepository.save(resultAnswer);
      });
      //????????????
      this.setReport(receipt_id, receipt_registration_number);
      //????????????
      return await this.receiptRegistrationRepository.update(
        {
          user_uuid,
          receipt_registration_number,
        },
        {
          receipt_registration_end: true,
          receipt_number_cookie: null,
        },
      );
    } else {
      return null;
    }
  } // ????????? db??? ????????? ???????????? ?????? ????????? ?????? db??? ??????????????? ?????? uuid??? applying_judge_id, applying_answer_id??? ?????? ?????? ??????
}
/* ????????? ??? ?????? ?????? ?????? ???????????? ?????? ???????????? ???????????? ????????? ?????? applying_answers???
????????? ???????????? applying_judge??? id??? ??????????????? ?????? ????????? ????????????.
?????? ????????? ?????? ????????? ??? applying_judge ???????????? applying_judge??? id?????? ?????? ????????????
?????????????????? ??????????????? applying_answer????????? ??? ????????? applying_judge_id ????????????
????????? ???????????????. ??? applying_answer_id??? ????????????.
?????? ??????????????? ??? user_uuid??? receipt_registration_number??? applying_answer_id ????????????
??????????????????. ?????? ?????? ????????? ??? ?????? ?????? receipt_registration_number???
?????? ??????????????? ???????????? ?????????. ????????? ?????? applying_answers??? judge_number??? ????????????.*/
