import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ReceiptEntity, ReceiptRegistrationEntity } from "./receipt.entity";
import { ReceiptController } from "./receipt.controller";
import { ReceiptService } from "./receipt.service";
import {
  ApplyingJudgeEntity,
  ApplyingAnswerEntity,
} from "../applying/applying.entity";
import { JudgeEntity } from "../judge.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ReceiptEntity,
      ReceiptRegistrationEntity,
      ApplyingJudgeEntity,
      JudgeEntity,
      ApplyingAnswerEntity,
    ]),
  ],
  controllers: [ReceiptController],
  providers: [ConfigService, JwtService, ReceiptService],
})
export class ReceiptModule {}
