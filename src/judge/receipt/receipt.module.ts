import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ReceiptEntity } from "./receipt.entity";
import { UserEntity } from "src/user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([ReceiptEntity, UserEntity])],
  controllers: [],
  providers: [ConfigService, JwtService],
})
export class UserModule {}
