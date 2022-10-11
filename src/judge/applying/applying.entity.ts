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

  @Column({ nullable: false })
  user_uuid: string;

  @Column({ nullable: false })
  receipt_registration_number: number;

  @Column({ nullable: false })
  judge_id: number;

  @Column({ nullable: false })
  judge_number: number;

  @Column({ nullable: false })
  applying_answer: string;

  @CreateDateColumn()
  applying_write_date: Date;

  @UpdateDateColumn()
  applying_update_date: Date;
}
