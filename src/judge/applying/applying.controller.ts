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

@Controller({
  path: "applying",
  version: "1",
})
export class ApplyingController {
  constructor(private readonly applyingService: ApplyingService) {}

  @Get()
  @UseGuards(AccessGuard, ApplyingGuard)
  async findAll(@Req() req): Promise<ApplyingJudgeEntity[]> {
    return this.applyingService.findAll(
      this.applyingService.getUUIDFromReq(req),
    );
  }

  @Post()
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async applyingAnswer() {
    return;
  }
}
