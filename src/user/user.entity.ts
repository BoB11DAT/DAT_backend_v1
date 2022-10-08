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
} from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ length: 20, nullable: false, unique: true })
  id: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Column({ length: 20, nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  pw: string;

  @Column({ type: "int", nullable: false })
  gender: number;

  @Column({ nullable: false })
  birth: Date;

  @Column({ nullable: false, unique: true })
  tell: string;

  @Column({ nullable: false })
  belong: string;

  @Column({ nullable: false })
  duty: string;

  @Column({ nullable: false })
  zip_code: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  address_detail: string;

  @Column({ type: "int", default: 0, nullable: false })
  accountType: number;

  @Column({ type: "int", default: 0, nullable: false, insert: false })
  role: number;

  @Column({ length: 200, nullable: true, select: false })
  refreshToken: string;

  @CreateDateColumn({ insert: false, select: false })
  createdDate: Date;

  @UpdateDateColumn({ insert: false, select: false })
  updatedDate: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async savePw(): Promise<void> {
    if (this.pw) {
      this.pw = await bcrypt.hash(this.pw, 10);
    }
  }

  @BeforeInsert()
  nullUUID(): void {
    if (this.uuid) {
      delete this.uuid;
    }
  }
}
