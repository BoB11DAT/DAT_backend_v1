import { Controller, Get, Post, Body } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUser } from "./user.interface";
import { UserEntity } from "./user.entity";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Get("findall")
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }
}
