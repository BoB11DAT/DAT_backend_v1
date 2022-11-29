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
import {
  GetReceiptRegistration,
  ReceiptRegistrationNumber,
} from "./receipt.interface";

@Controller({
  path: "receipt",
  version: "1",
})
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Get()
  @UseGuards(AccessGuard)
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
  async getReceiptRegistration(@Req() req): Promise<GetReceiptRegistration[]> {
    return this.receiptService.getReceiptRegistration(
      this.receiptService.getUUIDFromReq(req),
    );
  }

  @Get("registration/except")
  @UseGuards(AccessGuard)
  async getReceiptRegistrationExceptOpened(
    @Req() req,
  ): Promise<GetReceiptRegistration[]> {
    return this.receiptService.getReceiptRegistrationExceptOpened(
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
    ); //entity에서 interface로 바꾸기, round 대신 id로 바꾸기
  }

  @Post("round")
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async getRound(
    @Req() req,
    @Body() receiptRegistrationNumber: ReceiptRegistrationNumber,
  ): Promise<string> {
    return this.receiptService.getRound(
      this.receiptService.getUUIDFromReq(req),
      receiptRegistrationNumber.receipt_registration_number,
    );
  }

  @Post("apply")
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async createReceiptApplying(
    @Req() req,
    @Body() receiptRegistrationData: ReceiptRegistrationNumber,
  ) {
    return this.receiptService.receiptApplying(
      this.receiptService.getUUIDFromReq(req),
      receiptRegistrationData.receipt_registration_number,
    );
  }

  @Post("apply/continue")
  @UseGuards(AccessGuard)
  @HttpCode(200)
  async continueApplying(
    @Req() req,
    @Body() receiptRegistrationData: ReceiptRegistrationNumber,
  ) {
    return this.receiptService.continueApplying(
      this.receiptService.getUUIDFromReq(req),
      receiptRegistrationData.receipt_registration_number,
    );
  }
}
