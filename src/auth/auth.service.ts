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
    if (await this.getUserById(userData.id)) {
      throw new HttpException("User or Email already exists", 400);
    }
    if (await this.getUserByEmail(userData.email)) {
      throw new HttpException("User or Email already exists", 400);
    }
    const hashedpw = await bcrypt.hash(userData.pw, 10);
    const newUser = await this.userRepository.create({
      ...userData,
      pw: hashedpw,
    });
    return await this.userRepository.save(newUser);
  }

  async validateUser(id: string, pw: string): Promise<UserEntity> {
    const user = await this.getUserById(id);
    if (user && (await bcrypt.compare(pw, user.pw))) {
      return user;
    }
    return null;
  }

  async getUserById(id: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ where: { email } });
  }

  googleLogin(req) {
    if (!req.user) {
      return "No user from google";
    }
    return req.user;
  }

  async getRefreshToken(id: string): Promise<string> {
    const refreshToken = this.jwtService.sign(
      { id },
      {
        secret: this.config.get("REFRESH_TOKEN_SECRET"),
        expiresIn: this.config.get("REFRESH_TOKEN_EXPIRES_IN"),
      },
    );
    await this.userRepository.update({ id }, { refreshToken });
    return refreshToken;
  }

  getAccessToken(id: string): object {
    const accessToken = this.jwtService.sign(
      { id },
      {
        secret: this.config.get("ACCESS_TOKEN_SECRET"),
        expiresIn: this.config.get("ACCESS_TOKEN_EXPIRES_IN"),
      },
    );
    return { accessToken: accessToken };
  }

  logout() {
    return {
      domain: this.config.get("SERVICE_DOMAIN"),
      path: "/",
      httpOnly: true,
      maxAge: 0,
    };
  }

  async login(user: UserEntity) {
    const payload = { sub: user.id, name: user.username };
    return {
      access_token: "a",
    };
  }
}
