import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ReceiptModule } from "./receipt/receipt.module";

@Module({
  imports: [ReceiptModule],
  controllers: [],
  providers: [ConfigService, JwtService],
})
export class JudgeModule {}
