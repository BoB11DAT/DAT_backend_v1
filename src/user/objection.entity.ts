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

@Entity("objections")
export class ObjectionEntity {
  @PrimaryGeneratedColumn("increment")
  objection_id: number;

  @Column({ length: 36, nullable: false, select: false })
  user_uuid: string;

  @Column({ length: 40, nullable: false })
  receipt_registration_number: string;

  @Column({ nullable: false })
  receipt_judge_number: number;

  @Column({ type: "text", nullable: false })
  objection_title: string;

  @Column({ type: "text", nullable: false })
  objection_content: string;

  @Column({ default: false })
  objection_answered: boolean;

  @CreateDateColumn()
  objection_created_date: Date;

  @UpdateDateColumn({ select: false })
  objection_updated_date: Date;

  @DeleteDateColumn({ select: false })
  objection_deleted_date: Date;
}
