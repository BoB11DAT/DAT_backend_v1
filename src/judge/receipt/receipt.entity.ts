import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  AfterInsert,
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

  @CreateDateColumn()
  receipt_created_date: Date;

  @UpdateDateColumn()
  receipt_updated_date: Date;
}

@Entity("receipt_registrations")
export class ReceiptRegistrationEntity {
  @PrimaryGeneratedColumn("increment")
  receipt_registration_id: number;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @Column({ nullable: false })
  receipt_id: number;

  @Column({ length: 40, nullable: false })
  receipt_registration_number: string;

  @CreateDateColumn()
  receipt_registration_date: Date;

  @UpdateDateColumn()
  receipt_registration_update_date: Date;

  @AfterInsert()
  async createRegistrationNumber() {
    this.receipt_registration_number =
      this.receipt_registration_number.replace("P", "D") +
      "-" +
      this.receipt_registration_id.toString().padStart(4, "0");
  }
}
