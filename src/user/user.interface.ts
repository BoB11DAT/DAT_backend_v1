import { ApiProperty } from "@nestjs/swagger";

export class UpdateUser {
  @ApiProperty()
  id: string;
}

export interface User {
  uuid: string;
  id: string;
  email: string;
  username: string;
  pw: string;
  gender: number;
  birth: number;
  tell: string;
  belong: string;
  duty: string;
  zip_code: string;
  address: string;
  address_detail: string;
  accountType: number;
  role: number;
  refreshToken: string;
  createdDate: Date;
  updatedDate: Date;
}

export interface CreateUser {
  id: string;
  email: string;
  username: string;
  pw: string;
  gender: number;
  birth: number;
  tell: string;
  belong: string;
  duty: string;
  zip_code: string;
  address: string;
  address_detail: string;
  accountType: number;
  role: number;
}
