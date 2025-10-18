import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Exam } from "./entities/exam.entity"
import type { CreateExamDto } from "./dto/create-exam.dto"

@Injectable()
export class ExamsService {
  constructor(private examsRepository: Repository<Exam>) {}

  async create(createExamDto: CreateExamDto, teacherId: string) {
    const exam = this.examsRepository.create({
      ...createExamDto,
      teacher: { id: teacherId },
    })
    return this.examsRepository.save(exam)
  }

  async findAll(filters?: any) {
    const query = this.examsRepository
      .createQueryBuilder("exam")
      .leftJoinAndSelect("exam.subject", "subject")
      .leftJoinAndSelect("exam.teacher", "teacher")

    if (filters?.subjectId) {
      query.where("exam.subjectId = :subjectId", { subjectId: filters.subjectId })
    }

    if (filters?.teacherId) {
      query.andWhere("exam.teacherId = :teacherId", { teacherId: filters.teacherId })
    }

    return query.getMany()
  }

  async findById(id: string) {
    return this.examsRepository.findOne({
      where: { id },
      relations: ["subject", "teacher", "questions"],
    })
  }

  async update(id: string, updateData: any) {
    await this.examsRepository.update(id, updateData)
    return this.findById(id)
  }

  async delete(id: string) {
    return this.examsRepository.delete(id)
  }
}
