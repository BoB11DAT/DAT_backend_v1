import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ReceiptEntity, ReceiptRegistrationEntity } from "./receipt.entity";
import { ReceiptController } from "./receipt.controller";
import { ReceiptService } from "./receipt.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([ReceiptEntity, ReceiptRegistrationEntity]),
  ],
  controllers: [ReceiptController],
  providers: [ConfigService, JwtService, ReceiptService],
})
export class ReceiptModule {}
