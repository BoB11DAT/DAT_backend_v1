import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  AfterInsert,
  PrimaryColumn,
  DeleteDateColumn,
  BeforeInsert,
} from "typeorm";

@Entity("receipts")
export class ReceiptEntity {
  @PrimaryGeneratedColumn("increment")
  receipt_id: number;

  @Column({ length: 30, nullable: false, unique: true })
  receipt_round: string;

  @Column({ nullable: false })
  receipt_start_date: Date;

  @Column({ nullable: false })
  receipt_end_date: Date;

  @Column({ nullable: false })
  receipt_type: number; //아마 일반, 기업

  @CreateDateColumn({ select: false })
  receipt_created_date: Date;

  @UpdateDateColumn({ select: false })
  receipt_updated_date: Date;

  @DeleteDateColumn({ select: false })
  receipt_deleted_date: Date;
}

@Entity("receipt_registrations")
export class ReceiptRegistrationEntity {
  @PrimaryColumn({ length: 40 })
  receipt_registration_number: string;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ nullable: false, select: false })
  receipt_id: number;

  @Column({ nullable: false })
  receipt_available_start_date: Date;

  @Column({ nullable: false })
  receipt_available_end_date: Date;

  @Column({ nullable: false, default: false })
  receipt_registration_open: boolean;

  @Column({ nullable: false, default: false })
  receipt_registration_end: boolean;

  @Column({ length: 200, nullable: true, select: false })
  receipt_number_cookie: string;

  @CreateDateColumn({ select: false })
  receipt_registration_date: Date;

  @UpdateDateColumn({ select: false })
  receipt_registration_update_date: Date;

  @DeleteDateColumn({ select: false })
  receipt_registration_deleted_date: Date;

  @AfterInsert()
  delete() {
    delete this.user_uuid;
    delete this.receipt_id;
    delete this.receipt_registration_open;
    delete this.receipt_registration_end;
    delete this.receipt_registration_date;
    delete this.receipt_registration_update_date;
  }
}
