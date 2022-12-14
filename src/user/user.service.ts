import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserEntity } from "./user.entity";
import { UpdateUser } from "./user.interface";
import { ObjectionEntity } from "./objection.entity";
import { CreateObjection } from "./objection.interface";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(ObjectionEntity)
    private readonly objectionRepository: Repository<ObjectionEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}
  async getMyData(user_uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { user_uuid } });
  }

  getUUIDFromReq(req: any): string {
    return this.jwtService.verify(req.headers.authorization.split(" ")[1], {
      secret: this.config.get("ACCESS_TOKEN_SECRET"),
    }).user_uuid;
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async fetchUser(user_id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { user_id } });
  }

  async getUserByUUID(user_uuid: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { user_uuid } });
  }

  async updateUser(user_uuid: string, user: UpdateUser): Promise<UserEntity> {
    const userUpdate = this.userRepository.create({
      user_uuid,
      ...user,
    });
    await this.userRepository.save(userUpdate);
    return this.getUserByUUID(user_uuid);
  } //user role 등 바뀌는 취약점 있음

  async getObjection(user_uuid: string): Promise<ObjectionEntity[]> {
    return await this.objectionRepository.find({
      where: { user_uuid },
      select: [
        "objection_id",
        "objection_title",
        "objection_created_date",
        "objection_answered",
      ],
      order: { objection_created_date: "DESC" },
    });
  }

  async getObjectionDetail(
    user_uuid: string,
    objection_id: number,
  ): Promise<ObjectionEntity> {
    return await this.objectionRepository.findOne({
      where: { user_uuid, objection_id },
    });
  }

  async createObjection(
    user_uuid: string,
    objection: CreateObjection,
  ): Promise<void> {
    const objectionCreate = this.objectionRepository.create({
      user_uuid,
      ...objection,
    });
    await this.objectionRepository.save(objectionCreate);
  }
}
