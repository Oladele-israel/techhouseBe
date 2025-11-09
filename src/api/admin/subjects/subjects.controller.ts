import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
// import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';

// @ApiBearerAuth()
// @ApiTags('Admin - Subjects')
@Controller('admin/subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post('create')
//   @ApiOperation({ summary: 'Create a new subject' })
  create(@Body() dto: CreateSubjectDto) {
    return this.subjectsService.createSubject(dto);
  }

  @Get()
//   @ApiQuery({ name: 'classId', required: false, type: String })
//   @ApiOperation({ summary: 'Get all subjects (optionally filter by class)' })
  findAll(@Query('classId') classId?: string) {
    return this.subjectsService.getAllSubjects(classId);
  }

  @Get(':id')
//   @ApiOperation({ summary: 'Get a subject by ID' })
  findOne(@Param('id') id: string) {
    return this.subjectsService.getSubjectById(id);
  }

  @Patch(':id')
//   @ApiOperation({ summary: 'Update subject details' })
  update(@Param('id') id: string, @Body() dto: UpdateSubjectDto) {
    return this.subjectsService.updateSubject(id, dto);
  }

  @Delete(':id')
//   @ApiOperation({ summary: 'Soft delete subject' })
  remove(@Param('id') id: string) {
    return this.subjectsService.softDeleteSubject(id);
  }
}
