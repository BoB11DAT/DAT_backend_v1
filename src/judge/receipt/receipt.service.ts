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
    }).uuid;
  }

  async createReceipt(receipt: ReceiptEntity): Promise<ReceiptEntity> {
    const receiptCreated = this.ReceiptRepository.create(receipt);
    return await this.ReceiptRepository.save(receiptCreated);
  }

  async createReceiptRegistration(
    uuid: string,
    receiptRegistrationRound: string,
  ): Promise<ReceiptRegistrationEntity> {
    const receiptId = (
      await this.ReceiptRepository.findOne({
        where: { receipt_round: receiptRegistrationRound },
      })
    ).receipt_id;
    const receiptRegistrationCreated =
      this.ReceiptRegistrationRepository.create({
        receipt_id: receiptId,
        user_uuid: uuid,
        receipt_registration_number: receiptRegistrationRound,
      });
    return await this.ReceiptRegistrationRepository.save(
      receiptRegistrationCreated,
    );
  }
}
