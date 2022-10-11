import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { HttpException } from "@nestjs/common/exceptions/http.exception";
import bcrypt from "bcrypt";
import { CreateUser } from "src/user/user.interface";
import { UserEntity } from "src/user/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  getHello(): string {
    return "Hello World!";
  }

  async createUser(userData: CreateUser): Promise<UserEntity> {
    if (
      (await this.getUserByUUID(userData.id)) ||
      (await this.getUserByEmail(userData.email))
    ) {
      throw new HttpException("User or Email already exists", 400);
    }
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return this.getUserByUUID(userData.id);
  }

  async validateUser(id: string, pw: string): Promise<UserEntity> {
    const uuid = await this.getUUIDbyId(id);
    const user = await this.getUserPwByUUID(uuid);
    if (user && (await bcrypt.compare(pw, user.pw))) {
      return user;
    }
    return null;
  }

  async getUUIDbyId(id: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ["uuid"],
    });
    return user.uuid;
  }

  async getUserByUUID(uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { uuid } });
  }

  async getUserPwByUUID(uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { uuid },
      select: ["id", "pw"],
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserRefreshTokenByUUID(uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { uuid },
      select: ["refreshToken"],
    });
  }

  googleLogin(req) {
    if (!req.user) {
      return "No user from google";
    }
    return req.user;
  }

  async getRefreshToken(id: string): Promise<string> {
    const uuid = await this.getUUIDbyId(id);
    const refreshToken = this.getToken(uuid, "REFRESH");
    await this.userRepository.update({ uuid }, { refreshToken });
    return refreshToken;
  }

  getAccessToken(refreshToken: string): object {
    const uuid = this.getUUIDFromToken(refreshToken, "REFRESH");
    const accessToken = this.getToken(uuid, "ACCESS");
    return { accessToken: accessToken };
  }

  async refreshTokenMatch(
    uuid: string,
    refreshToken: string,
  ): Promise<boolean> {
    const user = await this.getUserRefreshTokenByUUID(uuid);
    if (user?.refreshToken === refreshToken) {
      return true;
    }
    return false;
  }

  async deleteRefreshToken(refreshToken: string): Promise<object> {
    const uuid = this.getUUIDFromToken(refreshToken, "REFRESH");
    await this.userRepository.update({ uuid }, { refreshToken: null as any });
    return {
      domain: this.config.get("SERVICE_DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: 0,
    };
  }

  getToken(uuid: string, kind: string): string {
    return this.jwtService.sign(
      { uuid },
      {
        secret: this.config.get(`${kind}_TOKEN_SECRET`),
        expiresIn: this.config.get(`${kind}_TOKEN_EXPIRES_IN`),
      },
    );
  }

  getUUIDFromToken(token: string, kind: string): string {
    return this.jwtService.verify(token, {
      secret: this.config.get(`${kind}_TOKEN_SECRET`),
    }).uuid;
  }

  async validPassword(accessToken: string, pw: string): Promise<boolean> {
    const id = this.getUUIDFromToken(accessToken, "ACCESS");
    const user = await this.getUserPwByUUID(id);
    if (user && (await bcrypt.compare(pw, user.pw))) {
      return true;
    }
    return false;
  }

  async checkAdmin(accessToken: string): Promise<boolean> {
    const uuid = this.getUUIDFromToken(accessToken, "ACCESS");
    const user = await this.getUserByUUID(uuid);
    if (user && user.role === 1) {
      return true;
    }
    return false;
  }
}
