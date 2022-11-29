import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from "@nestjs/common";
import { Request } from "express";
import { ReportService } from "./report.service";
import { ResultEntity, ResultAnswerEntity } from "../result/result.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { ReceiptRegistrationNumber } from "src/judge/receipt/receipt.interface";

@Controller({
  path: "report",
  version: "1",
})
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async getReportData(
    @Req() req,
    @Body() body: ReceiptRegistrationNumber,
  ): Promise<any> {
    return await this.reportService.getReportData(
      this.reportService.getUUIDFromReq(req),
      body.receipt_registration_number,
    );
  }

  @Post("create")
  @UseGuards(AdminGuard)
  async createReport(@Body() body): Promise<any> {
    return await this.reportService.setCorrectAnswerRate(body.receipt_id);
  }
}
