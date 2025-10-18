import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common"
import type { QuestionsService } from "./questions.service"
import type { CreateQuestionDto } from "./dto/create-question.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("questions")
@UseGuards(JwtAuthGuard)
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post()
  async create(createQuestionDto: CreateQuestionDto) {
    return this.questionsService.create(createQuestionDto)
  }

  @Get('exam/:examId')
  async findByExam(@Param('examId') examId: string) {
    return this.questionsService.findByExamId(examId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.questionsService.findById(id);
  }
}
