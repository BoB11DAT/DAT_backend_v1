import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
} from "@nestjs/common";
import { ReceiptService } from "./receipt.service";
import { ReceiptEntity, ReceiptRegistrationEntity } from "./receipt.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";

@Controller({
  path: "receipt",
  version: "1",
})
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

  @Get("registration")
  @UseGuards(AccessGuard)
  async getReceiptRegistration(
    @Req() req,
  ): Promise<ReceiptRegistrationEntity[]> {
    return this.receiptService.getReceiptRegistration(
      this.receiptService.getUUIDFromReq(req),
    );
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
    ); //entity에서 interface로 바꾸기
  }

  @Post("apply")
  @HttpCode(200)
  @UseGuards(AccessGuard)
  async createReceiptApplying(
    @Req() req,
    @Body() receiptRegistrationData: ReceiptRegistrationEntity,
  ) {
    return this.receiptService.receiptApplying(
      this.receiptService.getUUIDFromReq(req),
      receiptRegistrationData.receipt_registration_number,
    ); //entity에서 interface로 바꾸기
  }
}
