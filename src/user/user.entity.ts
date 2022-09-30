import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  uuid: string;

  @Column({ nullable: false, unique: true })
  id: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  username: string;

  @Column({ nullable: false })
  pw: string;

  @Column({ type: "int", nullable: false })
  gender: number;

  @Column({ type: "bigint", nullable: false })
  birth: number;

  @Column({ nullable: false })
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

  @Column({ type: "int", default: 0, nullable: false })
  role: number;

  @Column({ length: 200, nullable: true, select: false })
  refreshToken: string;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
