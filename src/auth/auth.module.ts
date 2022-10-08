import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserEntity } from "src/user/user.entity";
import { LocalStrategy } from "./local.strategy";
import { GoogleStrategy } from "./google.strategy";
import { JWTStrategy } from "./jwt.strategy";
import { RefreshStrategy } from "./refresh.strategy";
import { AccessStrategy } from "./access.strategy";
import { AdminStrategy } from "./admin.strategy";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), PassportModule, JwtModule],

  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    GoogleStrategy,
    JWTStrategy,
    RefreshStrategy,
    ConfigService,
    AccessStrategy,
    AdminStrategy,
  ],
})
export class AuthModule {}
