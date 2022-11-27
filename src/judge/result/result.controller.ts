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
import { ResultService } from "./result.service";
import { ResultEntity, ResultAnswerEntity } from "./result.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { CheckAnswer, Result, Solution } from "./result.interface";
import { ReceiptRegistrationNumber } from "src/judge/receipt/receipt.interface";

@Controller({
  path: "result",
  version: "1",
})
export class ReceiptController {
  constructor(private readonly resultService: ResultService) {}

  @Get()
  @UseGuards(AccessGuard)
  async findAll(@Req() req: Request): Promise<Result[]> {
    return await this.resultService.findAll(
      this.resultService.getUUIDFromReq(req),
    );
  }

  @Post()
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async getSolutions(
    @Req() req: Request,
    @Body() body: ReceiptRegistrationNumber,
  ): Promise<Solution[]> {
    return await this.resultService.getSolutions(
      this.resultService.getUUIDFromReq(req),
      body.receipt_registration_number,
    );
  }

  @Post("check/answer")
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async checkAnswer(@Body() body: CheckAnswer): Promise<boolean> {
    return await this.resultService.checkAnswer(body.judge_id, body.answer);
  }
}
