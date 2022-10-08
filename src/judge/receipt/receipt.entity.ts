import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("receipts")
export class ReceiptEntity {
  @PrimaryGeneratedColumn("increment")
  receipt_id: number;

  @Column({ nullable: false, unique: true })
  receipt_round: string;

  @Column({ nullable: false })
  receipt_start: Date;

  @DeleteDateColumn({ nullable: false })
  receipt_end: Date;

  @Column({ nullable: false, default: 0 })
  receipt_type: number;
}
