import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ReceiptEntity, ReceiptRegistrationEntity } from "./receipt.entity";

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(ReceiptEntity)
    private readonly ReceiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(ReceiptRegistrationEntity)
    private readonly ReceiptRegistrationRepository: Repository<ReceiptRegistrationEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  findAll(): Promise<ReceiptEntity[]> {
    return this.ReceiptRepository.find();
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async createReceipt(receipt: ReceiptEntity): Promise<ReceiptEntity> {
    const receiptCreated = this.ReceiptRepository.create(receipt);
    return await this.ReceiptRepository.save(receiptCreated);
  }

  async getReceiptRegistration(
    user_uuid: string,
  ): Promise<ReceiptRegistrationEntity[]> {
    return await this.ReceiptRegistrationRepository.find({
      where: { user_uuid },
    });
  }

  async createReceiptRegistration(
    user_uuid: string,
    receiptRegistrationRound: string,
  ): Promise<ReceiptRegistrationEntity> {
    const receiptId = (
      await this.ReceiptRepository.findOne({
        where: { receipt_round: receiptRegistrationRound },
      })
    ).receipt_id;
    const lastRegistrationNumber =
      await this.ReceiptRegistrationRepository.findOne({
        where: { receipt_id: receiptId },
        order: { receipt_registration_number: "DESC" },
      });
    const receipt_registration_number =
      receiptRegistrationRound.replace("P", "D") +
      "-" +
      (lastRegistrationNumber
        ? (lastRegistrationNumber.receipt_registration_id + 1)
            .toString()
            .padStart(4, "0")
        : "0001");
    const receiptRegistrationCreated =
      this.ReceiptRegistrationRepository.create({
        receipt_id: receiptId,
        user_uuid,
        receipt_registration_number,
      });
    const receiptRegistration = await this.ReceiptRegistrationRepository.save(
      receiptRegistrationCreated,
    );
    delete receiptRegistration.receipt_registration_id;
    delete receiptRegistration.user_uuid;
    delete receiptRegistration.receipt_registration_update_date;
    delete receiptRegistration.receipt_applying_start_date;
    delete receiptRegistration.receipt_applying_end_date;
    return receiptRegistration;
  }

  async receiptApplying(user_uuid: string, receiptRegistrationNumber: string) {
    const receiptRegistration =
      await this.ReceiptRegistrationRepository.findOne({
        where: {
          user_uuid,
          receipt_registration_number: receiptRegistrationNumber,
        },
      });
    receiptRegistration.receipt_applying_start_date = new Date();
    receiptRegistration.receipt_applying_end_date = new Date();
    receiptRegistration.receipt_applying_end_date.setDate(
      receiptRegistration.receipt_applying_end_date.getDate() + 7,
    );
    await this.ReceiptRegistrationRepository.save(receiptRegistration);
  }
}
