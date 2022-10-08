import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class AdminStrategy extends PassportStrategy(Strategy, "admin") {
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

  async validate(payload: any) {
    return this.authService.checkAdmin(
      payload.headers.authorization.split(" ")[1],
    );
  }
}
