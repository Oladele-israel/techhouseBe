import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"
import { StudentExam } from "./student-exam.entity"
import { Question } from "../../questions/entities/question.entity"

@Entity("student_answers")
export class StudentAnswer {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @ManyToOne(
    () => StudentExam,
    (studentExam) => studentExam.answers,
  )
  studentExam: StudentExam

  @ManyToOne(() => Question)
  question: Question

  @Column()
  selectedOption: number

  @Column()
  isCorrect: boolean
}
