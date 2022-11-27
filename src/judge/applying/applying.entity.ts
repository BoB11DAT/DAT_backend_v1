import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("applying_judges")
export class ApplyingJudgeEntity {
  @PrimaryGeneratedColumn("increment")
  applying_judge_id: number;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ length: 40, nullable: false, select: false })
  receipt_registration_number: string;

  @Column({ nullable: false })
  judge_id: number;

  @Column({ nullable: false })
  applying_judge_number: number; //할당된 문제 번호

  @CreateDateColumn({ select: false })
  applying_judge_created_date: Date;

  @UpdateDateColumn({ select: false })
  applying_judge_updated_date: Date;

  @DeleteDateColumn({ select: false })
  applying_judge_deleted_date: Date;
}

@Entity("applying_answers")
export class ApplyingAnswerEntity {
  @PrimaryGeneratedColumn("increment")
  applying_answer_id: number;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ length: 40, nullable: false, select: false })
  receipt_registration_number: string;

  @Column({ nullable: false })
  applying_judge_id: number;

  @Column({ nullable: false })
  judge_id: number;

  @Column({ nullable: false })
  applying_judge_number: number; //할당된 문제 번호

  @Column({ nullable: true })
  applying_answer_vector: number;

  @Column({ nullable: true })
  applying_answer: string;

  @CreateDateColumn({ select: false })
  applying_answer_created_date: Date;

  @UpdateDateColumn({ select: false })
  applying_answer_updated_date: Date;

  @DeleteDateColumn({ select: false })
  applying_answer_deleted_date: Date;
}
