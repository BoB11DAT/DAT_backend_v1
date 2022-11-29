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

@Entity("results")
export class ResultEntity {
  @PrimaryColumn({ length: 40, nullable: false, select: false })
  receipt_registration_number: string;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ nullable: false })
  receipt_id: number;

  @Column({ nullable: true, type: "text" })
  result_report: string;

  @CreateDateColumn({ select: false })
  result_created_date: Date;

  @UpdateDateColumn({ select: false })
  result_updated_date: Date;

  @DeleteDateColumn({ select: false })
  result_deleted_date: Date;
}

@Entity("result_answers")
export class ResultAnswerEntity {
  @PrimaryGeneratedColumn("increment")
  result_answer_id: number;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ length: 40, nullable: false, select: false })
  receipt_registration_number: string;

  @Column({ nullable: false })
  judge_id: number;

  @Column({ nullable: false })
  applying_answer_id: number;

  @Column({ nullable: false })
  receipt_judge_number: number; //할당된 문제 번호

  @Column({ nullable: false })
  result_answer_vector: number;

  @Column({ nullable: false })
  result_answer_correct: boolean;

  @CreateDateColumn({ select: false })
  result_answer_created_date: Date;

  @UpdateDateColumn({ select: false })
  result_answer_updated_date: Date;

  @DeleteDateColumn({ select: false })
  result_answer_deleted_date: Date;

  @BeforeInsert()
  parseNullVector() {
    if (this.result_answer_vector === null) {
      this.result_answer_vector = 33;
    }
  }
}
