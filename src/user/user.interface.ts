export class UpdateUser {
  user_email: string;
  user_username: string;
  user_pw: string;
  user_gender: number;
  user_birth: number;
  user_tell: string;
  user_belong: string;
  user_duty: string;
  user_zip_code: string;
  user_address: string;
  user_address_detail: string;
}

export interface User {
  user_uuid: string;
  user_id: string;
  user_email: string;
  user_name: string;
  user_pw: string;
  user_gender: number;
  user_birth: number;
  user_tell: string;
  user_belong: string;
  user_duty: string;
  user_zip_code: string;
  user_address: string;
  user_address_detail: string;
  user_account_type: number;
  user_role: number;
}

export interface CreateUser {
  user_id: string;
  user_email: string;
  user_username: string;
  user_pw: string;
  user_gender: number;
  user_birth: number;
  user_tell: string;
  user_belong: string;
  user_duty: string;
  user_zip_code: string;
  user_address: string;
  user_address_detail: string;
  user_account_type: number;
}
