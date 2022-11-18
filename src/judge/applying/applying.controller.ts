import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
} from "@nestjs/common";
import { ApplyingService } from "./applying.service";
import { ApplyingJudgeEntity, ApplyingAnswerEntity } from "./applying.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { ApplyingGuard } from "./applying.guard";
import { ApplyingAnswer, Judge } from "./applying.interface";
import { UpdateResult } from "typeorm";

@Controller({
  path: "applying",
  version: "1",
})
export class ApplyingController {
  constructor(private readonly applyingService: ApplyingService) {}

  @Get()
  @UseGuards(AccessGuard, ApplyingGuard)
  async findAll(@Req() req): Promise<Judge[]> {
    return this.applyingService.findAll(
      this.applyingService.getUUIDFromReq(req),
      this.applyingService.getReceiptNumberFromReq(req),
    );
  }

  @Get("answer")
  @UseGuards(AccessGuard, ApplyingGuard)
  async findAllAnswer(@Req() req): Promise<ApplyingAnswer[]> {
    return this.applyingService.findAllAnswer(
      this.applyingService.getUUIDFromReq(req),
      this.applyingService.getReceiptNumberFromReq(req),
    );
  }

  @Post("answer")
  @UseGuards(AccessGuard, ApplyingGuard)
  @HttpCode(200)
  async applyingAnswer(
    @Req() req,
    @Body() applyingAnswerData: ApplyingAnswer,
  ): Promise<UpdateResult> {
    return this.applyingService.applyingAnswer(
      this.applyingService.getUUIDFromReq(req),
      this.applyingService.getReceiptNumberFromReq(req),
      applyingAnswerData.applying_judge_number,
      applyingAnswerData.applying_answer,
    );
  }

  @Post("answer/vector")
  @UseGuards(AccessGuard, ApplyingGuard)
  @HttpCode(200)
  async applyingVector(
    @Req() req,
    @Body() applyingAnswerData: ApplyingAnswer,
  ): Promise<UpdateResult> {
    return this.applyingService.applyingVector(
      this.applyingService.getUUIDFromReq(req),
      this.applyingService.getReceiptNumberFromReq(req),
      applyingAnswerData.applying_judge_number,
      applyingAnswerData.applying_answer_vector,
    );
  }

  @Get("end")
  @UseGuards(AccessGuard, ApplyingGuard)
  async applyingEnd(@Req() req): Promise<UpdateResult> {
    return this.applyingService.applyingEnd(
      this.applyingService.getUUIDFromReq(req),
      this.applyingService.getReceiptNumberFromReq(req),
    );
  }
}
