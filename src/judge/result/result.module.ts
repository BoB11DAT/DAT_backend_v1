import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ResultEntity, ResultAnswerEntity } from "./result.entity";
import { ReceiptController } from "./result.controller";
import { ResultService } from "./result.service";
import { JudgeEntity } from "../judge.entity";
import { ReceiptEntity } from "../receipt/receipt.entity";
import { ApplyingJudgeEntity } from "../applying/applying.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ResultEntity,
      ResultAnswerEntity,
      JudgeEntity,
      ReceiptEntity,
      ApplyingJudgeEntity,
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ConfigService, JwtService, ResultService],
})
export class ResultModule {}
