import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
} from "typeorm";

@Entity("receipts")
export class ReceiptEntity {
  @PrimaryGeneratedColumn("increment")
  receipt_id: number;

  @Column({ length: 30, nullable: false, unique: true })
  receipt_round: string;

  @Column({ nullable: false })
  receipt_start: Date;

  @Column({ nullable: false })
  receipt_end: Date;

  @Column({ nullable: false })
  receipt_type: number;

  @CreateDateColumn({ select: false })
  receipt_created_date: Date;

  @UpdateDateColumn({ select: false })
  receipt_updated_date: Date;
}

@Entity("receipt_registrations")
export class ReceiptRegistrationEntity {
  @PrimaryGeneratedColumn("increment")
  receipt_registration_id: number;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ nullable: false })
  receipt_id: number;

  @Column({ length: 40, nullable: false, unique: true })
  receipt_registration_number: string;

  @Column({ nullable: true })
  receipt_applying_start_date: Date;

  @Column({ nullable: true })
  receipt_applying_end_date: Date;

  @Column({ nullable: false })
  receipt_registration_open: boolean;

  @CreateDateColumn({ select: false })
  receipt_registration_date: Date;

  @UpdateDateColumn({ select: false })
  receipt_registration_update_date: Date;
}
