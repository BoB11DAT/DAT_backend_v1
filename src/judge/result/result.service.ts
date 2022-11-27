import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { ResultEntity, ResultAnswerEntity } from "./result.entity";
import { JudgeEntity } from "../judge.entity";
import { ReceiptEntity } from "../receipt/receipt.entity";
import { ApplyingJudgeEntity } from "../applying/applying.entity";
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
    @InjectRepository(ApplyingJudgeEntity)
    private readonly applyingJudgeRepository: Repository<ApplyingJudgeEntity>,
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

  async getSolutions(
    user_uuid: string,
    receipt_registration_number: string,
  ): Promise<Solution[]> {
    const resultAnswers = (
      await this.resultAnswerRepository.find({
        where: { user_uuid, receipt_registration_number },
      })
    ).sort((a, b) => {
      return a.applying_judge_number - b.applying_judge_number;
    });
    const applyingJudges = (
      await this.applyingJudgeRepository.find({
        where: { user_uuid, receipt_registration_number },
      })
    ).sort((a, b) => {
      return a.applying_judge_number - b.applying_judge_number;
    });
    const judges = await Promise.all(
      applyingJudges.map(async (applyingJudge) => {
        return await this.judgeRepository.findOne({
          where: { judge_id: applyingJudge.judge_id },
        });
      }),
    );
    const solutions = resultAnswers.map((resultAnswer, index) => {
      return {
        applying_judge_number: applyingJudges[index].applying_judge_number,
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
