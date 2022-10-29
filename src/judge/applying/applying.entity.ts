import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("applying_judges")
export class ApplyingJudgeEntity {
  @PrimaryGeneratedColumn("increment")
  applying_judge_id: number;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ length: 40, nullable: false })
  receipt_registration_number: string;

  @Column({ nullable: false })
  judge_id: number;

  @Column({ nullable: false })
  applying_judge_number: number;

  @CreateDateColumn({ select: false })
  applying_judge_created_date: Date;

  @UpdateDateColumn({ select: false })
  applying_judge_updated_date: Date;
}

@Entity("applying_answers")
export class ApplyingAnswerEntity {
  @PrimaryGeneratedColumn("increment")
  applying_answer_id: number;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @Column({ length: 40, nullable: false })
  receipt_registration_number: string;

  @Column({ nullable: false })
  applying_judge_id: number;

  @Column({ nullable: true })
  applying_answer_vector: number;

  @Column({ nullable: true })
  applying_answer: string;

  @CreateDateColumn({ select: false })
  applying_answer_created_date: Date;

  @UpdateDateColumn({ select: false })
  applying_answer_updated_date: Date;
}
