import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ResultEntity, ResultAnswerEntity } from "./result.entity";
import { JudgeEntity } from "../judge.entity";
import {
  ReceiptEntity,
  ReceiptJudgeEntity,
  ReceiptRegistrationEntity,
} from "../receipt/receipt.entity";
import { Result, Solution } from "./result.interface";

@Injectable()
export class ResultService {
  constructor(
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

  getUUIDFromReq(req: Request): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async findAll(user_uuid: string): Promise<Result[]> {
    const results = await this.resultRepository.find({
      where: { user_uuid },
    });
    let resultsWithRound: Result[] = [];
    resultsWithRound = await Promise.all(
      results.map(async (result) => {
        const receipt = await this.receiptRepository.findOne({
          where: { receipt_id: result.receipt_id },
        });
        return {
          receipt_registration_number: result.receipt_registration_number,
          result_report: result.result_report,
          receipt_round: receipt.receipt_round,
        };
      }),
    );
    return resultsWithRound;
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

  async getSolutions(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<Solution[]> {
    const resultAnswers = (
      await this.resultAnswerRepository.find({
        where: { user_uuid, receipt_registration_number },
      })
    ).sort((a, b) => {
      return a.receipt_judge_number - b.receipt_judge_number;
    });
    const receiptRound = await this.getRound(
      user_uuid,
      receipt_registration_number,
    );
    const receiptId = (
      await this.receiptRepository.findOne({
        where: { receipt_round: receiptRound },
      })
    ).receipt_id;
    const receiptJudges = (
      await this.receiptJudgeRepository.find({
        where: { receipt_id: receiptId },
      })
    ).sort((a, b) => {
      return a.receipt_judge_number - b.receipt_judge_number;
    });
    const judges = await Promise.all(
      receiptJudges.map(async (applyingJudge) => {
        return await this.judgeRepository.findOne({
          where: { judge_id: applyingJudge.judge_id },
        });
      }),
    );
    const solutions = resultAnswers.map((resultAnswer, index) => {
      return {
        receipt_judge_number: receiptJudges[index].receipt_judge_number,
        judge_id: judges[index].judge_id,
        judge_content: judges[index].judge_content,
        judge_category: judges[index].judge_category,
        docdoc_url: judges[index].docdoc_url,
        result_answer_correct: resultAnswer.result_answer_correct,
      };
    });
    return solutions;
  }

  async checkAnswer(judge_id: number, answer: string): Promise<boolean> {
    const judge = await this.judgeRepository.findOne({
      where: { judge_id },
    });
    return judge.judge_answer === answer;
  }
}
