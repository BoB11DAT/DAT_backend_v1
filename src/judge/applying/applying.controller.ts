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
import { AuthGuard } from "@nestjs/passport";
import { ApplyingService } from "./applying.service";
import { ApplyingEntity } from "./applying.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Controller({
  path: "receipt",
  version: "1",
})
@UseGuards(AuthGuard("jwt-access-token"))
export class ApplyingController {
  constructor(private readonly applyingService: ApplyingService) {}

  @Get()
  async findAll(): Promise<ApplyingEntity[]> {
    return this.applyingService.findAll();
  }
}
