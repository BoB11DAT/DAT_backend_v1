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
    return await this.reportService.setReportData(body.receipt_id);
  }

  @Post("score")
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async getReportScore(
    @Req() req,
    @Body() body: ReceiptRegistrationNumber,
  ): Promise<any> {
    return await this.reportService.getScore(
      this.reportService.getUUIDFromReq(req),
      body.receipt_registration_number,
    );
  }

  @Post("vectors")
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async getTop3Vectors(
    @Req() req,
    @Body() body: ReceiptRegistrationNumber,
  ): Promise<any> {
    return await this.reportService.getTop3Vectors(
      this.reportService.getUUIDFromReq(req),
      body.receipt_registration_number,
    );
  }

  @Post("vectors/user")
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async getUserVectors(
    @Req() req,
    @Body() body: ReceiptRegistrationNumber,
  ): Promise<any> {
    return await this.reportService.getUserVectors(
      this.reportService.getUUIDFromReq(req),
      body.receipt_registration_number,
    );
  }
}
