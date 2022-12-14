import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { UserEntity } from "./user.entity";
import { UserService } from "./user.service";
import { ObjectionEntity } from "./objection.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, ObjectionEntity])],
  controllers: [UserController],
  providers: [UserService, ConfigService, JwtService],
})
export class UserModule {}
