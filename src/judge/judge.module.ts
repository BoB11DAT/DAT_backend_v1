import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ReceiptModule } from "./receipt/receipt.module";
import { ApplyingModule } from "./applying/applying.module";

@Module({
  imports: [ReceiptModule, ApplyingModule],
  controllers: [],
  providers: [ConfigService, JwtService],
})
export class JudgeModule {}
