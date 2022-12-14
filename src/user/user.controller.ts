import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Patch,
  Req,
  HttpCode,
  Param,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserEntity } from "./user.entity";
import { AccessGuard } from "src/auth/access.guard";
import { AdminGuard } from "src/auth/admin.guard";
import { UpdateUser } from "./user.interface";
import { ObjectionEntity } from "./objection.entity";
import { CreateObjection } from "./objection.interface";

@Controller({
  path: "user",
  version: "1",
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AccessGuard)
  getMyData(@Req() req): Promise<UserEntity> {
    return this.userService.getMyData(this.userService.getUUIDFromReq(req));
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
    return this.userService.fetchUser(body.user_id);
  }

  @Patch()
  @UseGuards(AccessGuard)
  async updateUser(@Req() req, @Body() user: UpdateUser): Promise<UserEntity> {
    return this.userService.updateUser(
      this.userService.getUUIDFromReq(req),
      user,
    );
  }

  @Get("objection")
  @UseGuards(AccessGuard)
  async getObjection(@Req() req): Promise<ObjectionEntity[]> {
    return this.userService.getObjection(this.userService.getUUIDFromReq(req));
  }

  @Get("objection/:objection_id")
  @UseGuards(AccessGuard)
  async getObjectionDetail(
    @Param("objection_id") objection_id: number,
    @Req() req,
  ): Promise<ObjectionEntity> {
    return this.userService.getObjectionDetail(
      this.userService.getUUIDFromReq(req),
      objection_id,
    );
  }

  @Post("objection")
  @UseGuards(AccessGuard)
  async createObjection(
    @Req() req,
    @Body() body: CreateObjection,
  ): Promise<void> {
    return this.userService.createObjection(
      this.userService.getUUIDFromReq(req),
      body,
    );
  }
}
