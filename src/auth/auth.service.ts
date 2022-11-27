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
      (await this.getUserById(userData.user_id)) ||
      (await this.getUserByEmail(userData.user_email))
    ) {
      throw new HttpException("User or Email already exists", 400);
    }
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return this.getUserById(userData.user_id);
  }

  async validateUser(id: string, pw: string): Promise<UserEntity> {
    const uuid = await this.getUUIDById(id);
    const user = await this.getUserPwByUUID(uuid);
    if (user && (await bcrypt.compare(pw, user.user_pw))) {
      return user;
    }
    return null;
  }

  async getUUIDById(user_id: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { user_id },
      select: ["user_uuid"],
    });
    return user.user_uuid;
  }

  async getUserById(user_id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { user_id } });
  }

  async getUserByUUID(user_uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { user_uuid } });
  }

  async getUserPwByUUID(user_uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { user_uuid },
      select: ["user_id", "user_pw"],
    });
  }

  async getUserByEmail(user_email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { user_email } });
  }

  async getUserRefreshTokenByUUID(user_uuid: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { user_uuid },
      select: ["user_refresh_token"],
    });
  }

  googleLogin(req) {
    if (!req.user) {
      return "No user from google";
    }
    return req.user;
  }

  async getRefreshToken(id: string): Promise<string> {
    const user_uuid = await this.getUUIDById(id);
    const user_refresh_token = this.getToken(user_uuid, "REFRESH");
    await this.userRepository.update({ user_uuid }, { user_refresh_token });
    return user_refresh_token;
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
    if (user?.user_refresh_token === refreshToken) {
      return true;
    }
    return false;
  }

  async deleteRefreshToken(refreshToken: string): Promise<object> {
    const user_uuid = this.getUUIDFromToken(refreshToken, "REFRESH");
    await this.userRepository.update(
      { user_uuid },
      { user_refresh_token: null as null },
    );
    return {
      domain: this.config.get("SERVICE_DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: 0,
    };
  }

  getToken(user_uuid: string, kind: string): string {
    return this.jwtService.sign(
      { user_uuid },
      {
        secret: this.config.get(`${kind}_TOKEN_SECRET`),
        expiresIn: this.config.get(`${kind}_TOKEN_EXPIRES_IN`),
      },
    );
  }

  getUUIDFromToken(token: string, kind: string): string {
    return this.jwtService.verify(token, {
      secret: this.config.get(`${kind}_TOKEN_SECRET`),
    }).user_uuid;
  }

  async validPassword(accessToken: string, pw: string): Promise<boolean> {
    const uuid = this.getUUIDFromToken(accessToken, "ACCESS");
    const user = await this.getUserPwByUUID(uuid);
    if (user && (await bcrypt.compare(pw, user.user_pw))) {
      return true;
    }
    return false;
  }

  async checkAdmin(accessToken: string): Promise<boolean> {
    const uuid = this.getUUIDFromToken(accessToken, "ACCESS");
    const user = await this.getUserByUUID(uuid);
    if (user && user.user_role === 1) {
      return true;
    }
    return false;
  }
}
