import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ResultEntity, ResultAnswerEntity } from "../result/result.entity";
import { ReportController } from "./report.controller";
import { ReportService } from "./report.service";
import { JudgeEntity } from "../judge.entity";
import {
  ReceiptEntity,
  ReceiptJudgeEntity,
  ReceiptRegistrationEntity,
} from "../receipt/receipt.entity";
import { ReportEntity, ReportAnswerEntity } from "./report.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultEntity,
      ResultAnswerEntity,
      JudgeEntity,
      ReceiptEntity,
      ReportEntity,
      ReceiptJudgeEntity,
      ReportAnswerEntity,
      ReceiptRegistrationEntity,
    ]),
  ],
  controllers: [ReportController],
  providers: [ConfigService, JwtService, ReportService],
})
export class ReportModule {}
