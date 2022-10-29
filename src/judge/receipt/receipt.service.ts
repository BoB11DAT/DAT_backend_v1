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
    private readonly receiptRepository: Repository<ReceiptEntity>,
    @InjectRepository(ReceiptRegistrationEntity)
    private readonly receiptRegistrationRepository: Repository<ReceiptRegistrationEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  findAll(): Promise<ReceiptEntity[]> {
    return this.receiptRepository.find();
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async createReceipt(receipt: ReceiptEntity): Promise<ReceiptEntity> {
    const receiptCreated = this.receiptRepository.create(receipt);
    return await this.receiptRepository.save(receiptCreated);
  }

  async getReceiptRegistration(
    user_uuid: string,
  ): Promise<ReceiptRegistrationEntity[]> {
    return await this.receiptRegistrationRepository.find({
      where: { user_uuid },
    });
  }

  async createReceiptRegistration(
    user_uuid: string,
    receiptRegistrationRound: string,
  ): Promise<ReceiptRegistrationEntity> {
    const receiptId = (
      await this.receiptRepository.findOne({
        where: { receipt_round: receiptRegistrationRound },
      })
    ).receipt_id;
    const lastRegistrationNumber =
      await this.receiptRegistrationRepository.findOne({
        where: { receipt_id: receiptId },
        order: { receipt_registration_number: "DESC" },
      });
    const receipt_registration_number =
      receiptRegistrationRound.replace("P", "D") +
      "-" +
      (lastRegistrationNumber
        ? (
            parseInt(
              lastRegistrationNumber.receipt_registration_number.substring(11),
            ) + 1
          )
            .toString()
            .padStart(4, "0")
        : "0001");
    const receiptRegistrationCreated =
      this.receiptRegistrationRepository.create({
        receipt_registration_number,
        receipt_id: receiptId,
        user_uuid,
      });
    const receiptRegistration = await this.receiptRegistrationRepository.save(
      receiptRegistrationCreated,
    );
    return receiptRegistration;
  }

  async receiptApplying(
    user_uuid: string,
    receipt_registration_number: string,
  ) {
    const receiptRegistration =
      await this.receiptRegistrationRepository.findOne({
        where: {
          user_uuid,
          receipt_registration_number,
        },
      });
    receiptRegistration.receipt_applying_start_date = new Date();
    receiptRegistration.receipt_applying_end_date = new Date();
    receiptRegistration.receipt_applying_end_date.setDate(
      receiptRegistration.receipt_applying_end_date.getDate() + 7,
    );
    await this.receiptRegistrationRepository.save(receiptRegistration);
  }
}
/*여기서 응시 시작할 때 문제 목록중에 카테고리별로 뽑아서 번호 부여하고 applying_judges에
넣고 foreach돌려서 applying_answers에 applying_judge_id가 들어간 칼럼 만들어야함*/
