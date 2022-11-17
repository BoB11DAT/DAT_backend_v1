import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class ApplyingStrategy extends PassportStrategy(
  Strategy,
  "receipt-registration-number",
) {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.refreshToken;
        },
      ]),
      secretOrKey: config.get("RECEIPT_NUMBER_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate() {
    return true;
  }
}
