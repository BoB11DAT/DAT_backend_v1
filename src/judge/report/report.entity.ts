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
  Double,
} from "typeorm";

@Entity("reports")
export class ReportEntity {
  @PrimaryGeneratedColumn("increment")
  report_id: number;

  @Column({ nullable: false, unique: true })
  receipt_id: number;

  @Column({ nullable: false, default: 0 })
  receipt_participants: number;
}

@Entity("report_answers")
export class ReportAnswerEntity {
  @PrimaryGeneratedColumn("increment")
  report_answer_id: number;

  @Column({ nullable: false })
  report_id: number;

  @Column({ nullable: false })
  reciept_judge_number: number;

  @Column({ nullable: false, default: 0 })
  report_correct_answer_count: number;

  report_correct_answer_rate: Double;
}
