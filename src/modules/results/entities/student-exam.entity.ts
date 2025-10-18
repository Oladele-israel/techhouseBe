import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn } from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Exam } from "../../exams/entities/exam.entity"
import { StudentAnswer } from "./student-answer.entity"

@Entity("student_exams")
export class StudentExam {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(
    () => User,
    (user) => user.studentExams,
  )
  student: User

  @ManyToOne(
    () => Exam,
    (exam) => exam.studentExams,
  )
  exam: Exam

  @Column()
  score: number

  @Column()
  correctAnswers: number

  @Column()
  totalQuestions: number

  @Column()
  submittedAt: Date

  @OneToMany(
    () => StudentAnswer,
    (answer) => answer.studentExam,
  )
  answers: StudentAnswer[]

  @CreateDateColumn()
  createdAt: Date
}
