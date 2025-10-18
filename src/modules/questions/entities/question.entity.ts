import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { Exam } from "../../exams/entities/exam.entity"

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  text: string

  @Column("simple-array")
  options: string[]

  @Column()
  correctOptionIndex: number

  @Column({ nullable: true })
  explanation: string

  @ManyToOne(
    () => Exam,
    (exam) => exam.questions,
    { onDelete: "CASCADE" },
  )
  exam: Exam

  @CreateDateColumn()
  createdAt: Date
}
