import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("judges")
export class JudgeEntity {
  @PrimaryGeneratedColumn("increment")
  judge_id: number;

  @Column({ nullable: false })
  judge: string;

  @Column({ nullable: false })
  judge_type: number;

  @Column({ nullable: false })
  judge_answer: string;

  @CreateDateColumn()
  judge_created_date: Date;

  @UpdateDateColumn()
  judge_updated_date: Date;
}
