import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm"
import { UserRole } from "../../../common/enums/user-role.enum"
import { Exam } from "../../exams/entities/exam.entity"
import { StudentExam } from "../../results/entities/student-exam.entity"

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string

  @Column()
  firstName: string

  @Column()
  lastName: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: "enum", enum: UserRole })
  role: UserRole

  @Column({ default: true })
  isActive: boolean

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @OneToMany(
    () => Exam,
    (exam) => exam.teacher,
  )
  exams: Exam[]

  @OneToMany(
    () => StudentExam,
    (studentExam) => studentExam.student,
  )
  studentExams: StudentExam[]
}
