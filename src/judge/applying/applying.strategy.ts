import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ApplyingService } from "./applying.service";

@Injectable()
export class ApplyingStrategy extends PassportStrategy(
  Strategy,
  "receipt-registration-number",
) {
  constructor(
    private readonly config: ConfigService,
    private readonly applyingService: ApplyingService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          return req?.cookies?.receiptRegistrationNumber;
        },
      ]),
      secretOrKey: config.get("RECEIPT_NUMBER_SECRET"),
      passReqToCallback: true,
    });
  }

  async validate(req, payload: any) {
    const receiptNumber = req.cookies?.receiptRegistrationNumber;
    return await this.applyingService.receiptNumberMatch(
      payload.receipt_registration_number,
      receiptNumber,
    );
  }
}
