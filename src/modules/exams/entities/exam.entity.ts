import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm"
import { User } from "../../users/entities/user.entity"
import { Subject } from "../../subjects/entities/subject.entity"
import { Question } from "../../questions/entities/question.entity"
import { StudentExam } from "../../results/entities/student-exam.entity"

@Entity("exams")
export class Exam {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  description: string

  @Column()
  duration: number

  @Column()
  totalQuestions: number

  @Column()
  passingScore: number

  @Column()
  startTime: Date

  @Column()
  endTime: Date

  @ManyToOne(
    () => User,
    (user) => user.exams,
  )
  teacher: User

  @ManyToOne(
    () => Subject,
    (subject) => subject.exams,
  )
  subject: Subject

  @OneToMany(
    () => Question,
    (question) => question.exam,
  )
  questions: Question[]

  @OneToMany(
    () => StudentExam,
    (studentExam) => studentExam.exam,
  )
  studentExams: StudentExam[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}
