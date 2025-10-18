import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Question } from "./entities/question.entity"
import type { CreateQuestionDto } from "./dto/create-question.dto"

@Injectable()
export class QuestionsService {
  constructor(private questionsRepository: Repository<Question>) {}

  async create(createQuestionDto: CreateQuestionDto) {
    const question = this.questionsRepository.create(createQuestionDto)
    return this.questionsRepository.save(question)
  }

  async findByExamId(examId: string) {
    return this.questionsRepository.find({
      where: { exam: { id: examId } },
    })
  }

  async findById(id: string) {
    return this.questionsRepository.findOne({ where: { id } })
  }

  async update(id: string, updateData: any) {
    await this.questionsRepository.update(id, updateData)
    return this.findById(id)
  }

  async delete(id: string) {
    return this.questionsRepository.delete(id)
  }
}
