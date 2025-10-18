import { Controller, Get, Post, Param, UseGuards, Request, Query } from "@nestjs/common"
import type { ExamsService } from "./exams.service"
import type { CreateExamDto } from "./dto/create-exam.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("exams")
@UseGuards(JwtAuthGuard)
export class ExamsController {
  constructor(private examsService: ExamsService) {}

  @Post()
  async create(createExamDto: CreateExamDto, @Request() req) {
    return this.examsService.create(createExamDto, req.user.id)
  }

  @Get()
  async findAll(@Query() filters: any) {
    return this.examsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.examsService.findById(id);
  }
}
