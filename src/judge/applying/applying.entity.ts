import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("applying")
export class ApplyingEntity {
  @PrimaryGeneratedColumn("increment")
  applying_id: number;

  @Column({ length: 36, nullable: false })
  user_uuid: string;

  @Column({ length: 40, nullable: false })
  receipt_registration_number: string;

  @Column({ nullable: false })
  judge_id: number;

  @Column({ nullable: false })
  judge_number: number;

  @Column({ nullable: false })
  applying_vector: number;

  @Column({ nullable: false })
  applying_answer: string;

  @CreateDateColumn({ select: false })
  applying_created_date: Date;

  @UpdateDateColumn({ select: false })
  applying_updated_date: Date;
}
