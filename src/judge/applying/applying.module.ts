import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ApplyingAnswerEntity } from "./applying.entity";
import { ApplyingController } from "./applying.controller";
import { ApplyingService } from "./applying.service";
import { ApplyingStrategy } from "./applying.strategy";
import { JudgeEntity } from "../judge.entity";
import {
  ReceiptEntity,
  ReceiptRegistrationEntity,
  ReceiptJudgeEntity,
} from "../receipt/receipt.entity";
import { ResultEntity, ResultAnswerEntity } from "../result/result.entity";
import { ReportEntity, ReportAnswerEntity } from "../report/report.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApplyingAnswerEntity,
      ReceiptJudgeEntity,
      ReceiptEntity,
      JudgeEntity,
      ReceiptRegistrationEntity,
      ResultEntity,
      ResultAnswerEntity,
      ReportEntity,
      ReportAnswerEntity,
    ]),
    PassportModule,
    JwtModule,
  ],
  controllers: [ApplyingController],
  providers: [ConfigService, JwtService, ApplyingService, ApplyingStrategy],
})
export class ApplyingModule {}
