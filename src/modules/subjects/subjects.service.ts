import { Injectable } from "@nestjs/common"
import type { Repository } from "typeorm"
import type { Subject } from "./entities/subject.entity"
import type { CreateSubjectDto } from "./dto/create-subject.dto"

@Injectable()
export class SubjectsService {
  constructor(private subjectsRepository: Repository<Subject>) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const subject = this.subjectsRepository.create(createSubjectDto)
    return this.subjectsRepository.save(subject)
  }

  async findAll() {
    return this.subjectsRepository.find()
  }

  async findById(id: string) {
    return this.subjectsRepository.findOne({ where: { id } })
  }

  async update(id: string, updateData: any) {
    await this.subjectsRepository.update(id, updateData)
    return this.findById(id)
  }

  async delete(id: string) {
    return this.subjectsRepository.delete(id)
  }
}
