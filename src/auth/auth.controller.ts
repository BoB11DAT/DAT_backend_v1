import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  HttpCode,
  Req,
  Res,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { CreateUser } from "src/user/user.interface";
import { UserEntity } from "src/user/user.entity";
import { ConfigService } from "@nestjs/config";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(AuthGuard("jwt"))
  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

  @Post("create")
  async createUser(@Body() userData: CreateUser): Promise<UserEntity> {
    return this.authService.createUser(userData);
  }

  @HttpCode(200)
  @UseGuards(AuthGuard("local"))
  @Post("login")
  async login(@Req() req, @Res() res) {
    const { user } = req;
    const refreshToken = await this.authService.getRefreshToken(user.id);
    res.cookie("refreshToken", refreshToken, {
      domain: this.config.get("SERVICE_DOMAIN"),
      httpOnly: this.config.get("NODE_ENV") === "production",
      secure: this.config.get("NODE_ENV") === "production",
      maxAge: 2592000000,
    });
    return res.redirect(this.config.get("CLIENT_URL"));
  }

  @Get("google")
  @UseGuards(AuthGuard("google"))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth(@Req() req) {}

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  googleAuthRedirect(@Req() req) {
    return this.authService.googleLogin(req);
  }
}
