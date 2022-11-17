import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";

@Entity("judges")
export class JudgeEntity {
  @PrimaryGeneratedColumn("increment")
  judge_id: number;

  @Column({ nullable: false })
  judge_content: string;

  @Column({ nullable: false })
  judge_type: number;

  @Column({ nullable: false })
  judge_category: number;

  @Column({ nullable: false })
  judge_difficulty: number;

  @Column({ nullable: false })
  judge_vector: number;

  @Column({ nullable: false })
  judge_answer: string;

  @Column({ nullable: false })
  docdoc_url: string;

  @CreateDateColumn({ select: false })
  judge_created_date: Date;

  @UpdateDateColumn({ select: false })
  judge_updated_date: Date;

  @DeleteDateColumn({ select: false })
  judge_deleted_date: Date;
}
