import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ApplyingJudgeEntity, ApplyingAnswerEntity } from "./applying.entity";
import { ApplyingController } from "./applying.controller";
import { ApplyingService } from "./applying.service";
import { ApplyingStrategy } from "./applying.strategy";

@Module({
  imports: [
    TypeOrmModule.forFeature([ApplyingAnswerEntity, ApplyingJudgeEntity]),
    PassportModule,
    JwtModule,
  ],
  controllers: [ApplyingController],
  providers: [ConfigService, JwtService, ApplyingService, ApplyingStrategy],
})
export class ApplyingModule {}
