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
      (await this.getUserById(userData.id)) ||
      (await this.getUserByEmail(userData.email))
    ) {
      throw new HttpException("User or Email already exists", 400);
    }
    const newUser = await this.userRepository.create(userData);
    await this.userRepository.save(newUser);
    return this.getUserById(userData.id);
  }

  async validateUser(id: string, pw: string): Promise<UserEntity> {
    const user = await this.getUserPwById(id);
    if (user && (await bcrypt.compare(pw, user.pw))) {
      return user;
    }
    return null;
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserPwById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id },
      select: ["id", "pw"],
    });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async getUserRefreshTokenById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({
      where: { id },
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
    const refreshToken = this.getToken(id, "REFRESH");
    await this.userRepository.update({ id }, { refreshToken });
    return refreshToken;
  }

  getAccessToken(refreshToken: string): object {
    const id = this.getIdFromToken(refreshToken, "REFRESH");
    const accessToken = this.getToken(id, "ACCESS");
    return { accessToken: accessToken };
  }

  async refreshTokenMatch(id: string, refreshToken: string): Promise<boolean> {
    const user = await this.getUserRefreshTokenById(id);
    if (user?.refreshToken === refreshToken) {
      return true;
    }
    return false;
  }

  async deleteRefreshToken(refreshToken: string): Promise<object> {
    const id = this.getIdFromToken(refreshToken, "REFRESH");
    await this.userRepository.update({ id }, { refreshToken: null as any });
    return {
      domain: this.config.get("SERVICE_DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: 0,
    };
  }

  getToken(id: string, kind: string): string {
    return this.jwtService.sign(
      { id },
      {
        secret: this.config.get(`${kind}_TOKEN_SECRET`),
        expiresIn: this.config.get(`${kind}_TOKEN_EXPIRES_IN`),
      },
    );
  }

  getIdFromToken(token: string, kind: string): string {
    return this.jwtService.verify(token, {
      secret: this.config.get(`${kind}_TOKEN_SECRET`),
    }).id;
  }

  async validPassword(accessToken: string, pw: string): Promise<boolean> {
    const id = this.getIdFromToken(accessToken, "ACCESS");
    const user = await this.getUserPwById(id);
    if (user && (await bcrypt.compare(pw, user.pw))) {
      return true;
    }
    return false;
  }

  async checkAdmin(accessToken: string): Promise<boolean> {
    const id = this.getIdFromToken(accessToken, "ACCESS");
    const user = await this.getUserById(id);
    if (user && user.role === 1) {
      return true;
    }
    return false;
  }
}
