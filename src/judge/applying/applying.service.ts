import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ApplyingEntity } from "./applying.entity";

@Injectable()
export class ApplyingService {
  constructor(
    @InjectRepository(ApplyingEntity)
    private readonly ReceiptRepository: Repository<ApplyingEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  findAll(user_uuid: string): Promise<ApplyingEntity[]> {
    return this.ReceiptRepository.find({ where: { user_uuid } });
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }
}
