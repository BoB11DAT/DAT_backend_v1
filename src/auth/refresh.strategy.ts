import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class RefreshStrategy extends PassportStrategy(
  Strategy,
  "jwt-refresh-token",
) {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: config.get("REFRESH_TOKEN_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: { user_uuid: string }) {
    const refreshToken = req.cookies?.refreshToken;
    return await this.authService.refreshTokenMatch(
      payload.user_uuid,
      refreshToken,
    );
  }
}
