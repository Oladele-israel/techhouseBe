import { Controller, Get, Post, Body, Param } from "@nestjs/common"
import type { SubjectsService } from "./subjects.service"
import type { CreateSubjectDto } from "./dto/create-subject.dto"

@Controller("subjects")
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  @Post()
  async create(@Body() createSubjectDto: CreateSubjectDto) {
    return this.subjectsService.create(createSubjectDto);
  }

  @Get()
  async findAll() {
    return this.subjectsService.findAll()
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.subjectsService.findById(id);
  }
}
