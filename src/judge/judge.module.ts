import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ReceiptModule } from "./receipt/receipt.module";
import { ApplyingModule } from "./applying/applying.module";
import { ResultModule } from "./result/result.module";
import { ReportModule } from "./report/report.module";

@Module({
  imports: [ReceiptModule, ApplyingModule, ResultModule, ReportModule],
  controllers: [],
  providers: [ConfigService, JwtService],
})
export class JudgeModule {}
