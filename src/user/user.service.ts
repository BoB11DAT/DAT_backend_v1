import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { UserEntity } from "./user.entity";
import { UpdateUser } from "./user.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  getHello(): string {
    return "Hello World!";
  }

  getIdFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).id;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async getUserById(id: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { id } });
  }

  async updateUser(id: string, user: UpdateUser): Promise<any> {
    const userBefore = await this.getUserById(id);
    const userUpdate = this.userRepository.create({
      ...userBefore,
      ...user,
    });
    await this.userRepository.save(userUpdate);
    return this.getUserById(id);
  }
}
