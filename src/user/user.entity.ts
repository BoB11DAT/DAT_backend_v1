import { IsEmail } from "class-validator";
import bcrypt from "bcrypt";
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
} from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  user_uuid: string;

  @Column({ length: 20, nullable: false, unique: true })
  user_id: string;

  @Column({ length: 254, nullable: false, unique: true })
  @IsEmail()
  user_email: string;

  @Column({ length: 20, nullable: false })
  user_name: string;

  @Column({ length: 200, nullable: false, select: false })
  user_pw: string;

  @Column({ type: "int", nullable: true })
  user_gender: number;

  @Column({ nullable: false })
  user_birth: Date;

  @Column({ length: 20, nullable: false, unique: true })
  user_tell: string;

  @Column({ length: 50, nullable: true })
  user_belong: string;

  @Column({ length: 30, nullable: true })
  user_duty: string;

  @Column({ length: 10, nullable: true })
  user_zip_code: string;

  @Column({ length: 254, nullable: true })
  user_address: string;

  @Column({ length: 100, nullable: true })
  user_address_detail: string;

  @Column({ default: 0, nullable: false })
  user_account_type: number;

  @Column({ default: 0, nullable: false, insert: false, update: false })
  user_role: number;

  @Column({ length: 200, nullable: true, select: false })
  user_refresh_token: string;

  @CreateDateColumn({ insert: false, select: false })
  user_created_date: Date;

  @UpdateDateColumn({ insert: false, select: false })
  user_updated_date: Date;

  @DeleteDateColumn({ insert: false, select: false })
  user_deleted_at: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async savePw(): Promise<void> {
    if (this.user_pw) {
      this.user_pw = await bcrypt.hash(this.user_pw, 10);
    }
  }

  @BeforeInsert()
  nullUUID(): void {
    if (this.user_uuid) {
      delete this.user_uuid;
    }
  }
}
