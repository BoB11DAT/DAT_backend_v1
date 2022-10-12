import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ApplyingEntity } from "./applying.entity";
import { ApplyingController } from "./applying.controller";
import { ApplyingService } from "./applying.service";

@Module({
  imports: [TypeOrmModule.forFeature([ApplyingEntity])],
  controllers: [ApplyingController],
  providers: [ConfigService, JwtService, ApplyingService],
})
export class ApplyingModule {}
