import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm"
import { Exam } from "../../exams/entities/exam.entity"

@Entity("subjects")
export class Subject {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(
    () => Exam,
    (exam) => exam.subject,
  )
  exams: Exam[]
}
