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
import { ApplyingEntity } from "./applying.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Controller({
  path: "applying",
  version: "1",
})
export class ApplyingController {
  constructor(private readonly applyingService: ApplyingService) {}

  @Get()
  @UseGuards(AccessGuard)
  async findAll(@Req() req): Promise<ApplyingEntity[]> {
    return this.applyingService.findAll(
      this.applyingService.getUUIDFromReq(req),
    );
  }

  
}
