import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [
    RouterModule.register([{}]),
  ],
  controllers: [],
  providers: [ConfigService, JwtService],
})
export class JudgeModule {}
