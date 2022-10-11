import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { UpdateUser } from "./user.interface";

@Controller({
  path: "user",
  version: "1",
})
@UseGuards(AuthGuard("jwt-access-token"))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AccessGuard)
  getHello(): string {
    return this.userService.getHello();
  }

  @Get("findall")
  @UseGuards(AdminGuard)
  async findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Post("fetch")
  @HttpCode(200)
  @UseGuards(AdminGuard)
  async fetchUser(@Body() body): Promise<UserEntity> {
    return this.userService.fetchUser(body.id);
  }

  @Patch()
  @UseGuards(AccessGuard)
  async updateUser(@Req() req, @Body() user: UpdateUser): Promise<UserEntity> {
    return this.userService.updateUser(
      this.userService.getUUIDFromReq(req),
      user,
    );
  }
}
