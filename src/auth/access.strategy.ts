import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class AccessStrategy extends PassportStrategy(
  Strategy,
  "jwt-access-token",
) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get("ACCESS_TOKEN_SECRET"),
      passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate() {
    return true;
  }
}
