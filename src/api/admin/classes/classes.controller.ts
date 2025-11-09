import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { ClassesService } from './classes.service';

@Controller('admin/classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Post('create')
  create(@Body() dto: CreateClassDto) {
    return this.classesService.createClass(dto);
  }

  @Get()
  findAll() {
    return this.classesService.getAllClasses();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classesService.getClassById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClassDto) {
    return this.classesService.updateClass(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classesService.softDeleteClass(id);
  }
}
