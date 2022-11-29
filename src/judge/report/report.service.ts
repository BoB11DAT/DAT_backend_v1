import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ResultEntity, ResultAnswerEntity } from "../result/result.entity";
import { ReportEntity, ReportAnswerEntity } from "./report.entity";
import { JudgeEntity } from "../judge.entity";
import {
  ReceiptEntity,
  ReceiptJudgeEntity,
  ReceiptRegistrationEntity,
} from "../receipt/receipt.entity";
import { ReportData } from "./report.interface";

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    @InjectRepository(ReportAnswerEntity)
    private readonly reportAnswerRepository: Repository<ReportAnswerEntity>,
    @InjectRepository(ResultEntity)
    private readonly resultRepository: Repository<ResultEntity>,
    @InjectRepository(ResultAnswerEntity)
    private readonly resultAnswerRepository: Repository<ResultAnswerEntity>,
    @InjectRepository(JudgeEntity)
    private readonly judgeRepository: Repository<JudgeEntity>,
    @InjectRepository(ReceiptEntity)
    private readonly receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(ReceiptJudgeEntity)
    private readonly receiptJudgeRepository: Repository<ReceiptJudgeEntity>,
    @InjectRepository(ReceiptRegistrationEntity)
    private readonly receiptRegistrationRepository: Repository<ReceiptRegistrationEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  async getReceiptId(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<number> {
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
    return receiptRegistration.receipt_id;
  }

  getUUIDFromReq(req: Request): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async getReportData(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<any> {
    const receipt_id = await this.getReceiptId(
      user_uuid,
      receipt_registration_number,
    );
    const report = await this.reportRepository.findOne({
      where: { receipt_id },
    });
    const reportAnswers = await this.reportAnswerRepository.find({
      where: { report_id: report.report_id },
    });
    const reportData: ReportData[] = [];
    reportAnswers.forEach((reportAnswer) => {
      reportAnswer.report_correct_answer_rate =
        Math.floor(
          (reportAnswer.report_correct_answer_count /
            report.receipt_participants) *
            1000,
        ) / 10;
      reportData.push({
        receipt_judge_number: reportAnswer.reciept_judge_number,
        report_correct_answer_rate: reportAnswer.report_correct_answer_rate,
      });
    });
    const resultAnswers = await this.resultAnswerRepository.find({
      where: { user_uuid, receipt_registration_number },
    });
    resultAnswers.forEach((resultAnswer, i) => {
      reportData[i].result_answer_correct = resultAnswer.result_answer_correct;
    });
    const receiptJudges = await this.receiptJudgeRepository.find({
      where: { receipt_id },
    });
    const judges = await this.judgeRepository.find();
    receiptJudges.forEach(async (receiptJudge, i) => {
      const judge = judges.find(
        (judge) => judge.judge_id === receiptJudge.judge_id,
      );
      reportData[i].judge_type = judge.judge_type;
      reportData[i].judge_difficulty = judge.judge_difficulty;
    });
    return reportData;
  }

  async setCorrectAnswerRate(receipt_id: number): Promise<any> {
    let reportEntity = this.reportRepository.create();
    reportEntity.receipt_id = receipt_id;
    reportEntity = await this.reportRepository.save(reportEntity);
    for (let i = 0; i < 70; i++) {
      const report = this.reportAnswerRepository.create();
      report.report_id = reportEntity.report_id;
      report.reciept_judge_number = i + 1;
      await this.reportAnswerRepository.save(report);
    }
    const results = await this.resultRepository.find({
      where: { receipt_id },
    });
    // set correct answer rate
    results.forEach(async (result) => {
      const resultAnswers = await this.resultAnswerRepository.find({
        where: {
          receipt_registration_number: result.receipt_registration_number,
        },
      });
      reportEntity.receipt_participants += 1;
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
    });
    return;
  }
}
