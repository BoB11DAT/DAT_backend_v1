import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ResultEntity, ResultAnswerEntity } from "./result.entity";
import { ReceiptController } from "./result.controller";
import { ResultService } from "./result.service";
import { JudgeEntity } from "../judge.entity";
import {
  ReceiptEntity,
  ReceiptRegistrationEntity,
  ReceiptJudgeEntity,
} from "../receipt/receipt.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultEntity,
      ResultAnswerEntity,
      JudgeEntity,
      ReceiptEntity,
      ReceiptRegistrationEntity,
      ReceiptJudgeEntity,
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ConfigService, JwtService, ResultService],
})
export class ResultModule {}
