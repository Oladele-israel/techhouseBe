import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { StudentExam } from "./entities/student-exam.entity"
import type { StudentAnswer } from "./entities/student-answer.entity"

@Injectable()
export class ResultsService {
  private studentExamRepository: Repository<StudentExam>
  private studentAnswerRepository: Repository<StudentAnswer>

  constructor(studentExamRepository: Repository<StudentExam>, studentAnswerRepository: Repository<StudentAnswer>) {
    this.studentExamRepository = studentExamRepository
    this.studentAnswerRepository = studentAnswerRepository
  }

  async submitExam(studentId: string, examId: string, answers: any[]) {
    // Calculate score
    let correctAnswers = 0
    for (const answer of answers) {
      if (answer.isCorrect) {
        correctAnswers++
      }
    }

    const score = (correctAnswers / answers.length) * 100

    // Save student exam result
    const studentExam = this.studentExamRepository.create({
      student: { id: studentId },
      exam: { id: examId },
      score,
      correctAnswers,
      totalQuestions: answers.length,
      submittedAt: new Date(),
    })

    const savedExam = await this.studentExamRepository.save(studentExam)

    // Save individual answers
    for (const answer of answers) {
      const studentAnswer = this.studentAnswerRepository.create({
        studentExam: savedExam,
        question: { id: answer.questionId },
        selectedOption: answer.selectedOption,
        isCorrect: answer.isCorrect,
      })
      await this.studentAnswerRepository.save(studentAnswer)
    }

    return savedExam
  }

  async getStudentResults(studentId: string) {
    return this.studentExamRepository.find({
      where: { student: { id: studentId } },
      relations: ["exam", "exam.subject"],
    })
  }

  async getExamResults(examId: string) {
    return this.studentExamRepository.find({
      where: { exam: { id: examId } },
      relations: ["student"],
    })
  }

  async getDetailedResult(studentExamId: string) {
    return this.studentExamRepository.findOne({
      where: { id: studentExamId },
      relations: ["exam", "exam.subject", "student", "answers", "answers.question"],
    })
  }
}
