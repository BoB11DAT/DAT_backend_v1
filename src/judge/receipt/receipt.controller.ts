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
import { ReceiptService } from "./receipt.service";
import { ReceiptEntity, ReceiptRegistrationEntity } from "./receipt.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Controller({
  path: "receipt",
  version: "1",
})
@UseGuards(AuthGuard("jwt-access-token"))
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Get()
  async findAll(): Promise<ReceiptEntity[]> {
    return this.receiptService.findAll();
  }

  @Post()
  @UseGuards(AdminGuard)
  async createReceipt(
    @Body() receiptData: ReceiptEntity,
  ): Promise<ReceiptEntity> {
    return this.receiptService.createReceipt(receiptData);
  }

  @Post("registration")
  @UseGuards(AccessGuard)
  async createReceiptRegistration(
    @Req() req,
    @Body() receiptRegistrationData: ReceiptEntity,
  ): Promise<ReceiptRegistrationEntity> {
    return this.receiptService.createReceiptRegistration(
      this.receiptService.getUUIDFromReq(req),
      receiptRegistrationData.receipt_round,
    );
  }
}
