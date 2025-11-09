import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ClassRepository } from './repository/class.repository';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassesService {
  constructor(private readonly classRepo: ClassRepository) {}

  async createClass(dto: CreateClassDto) {
    const existing = await this.classRepo.findClass({
      where: { name: dto.name, classType: dto.classType, isDeleted: false },
    });

    if (existing) {
      throw new BadRequestException('Class with this name and type already exists');
    }

    const newClass = await this.classRepo.createClass({
      data: {
        name: dto.name,
        classType: dto.classType,
      },
    });

    return {
      message: 'Class created successfully',
      data: newClass,
    };
  }

  async getAllClasses() {
    const classes = await this.classRepo.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return { total: classes.length, data: classes };
  }

  async getClassById(id: string) {
    const found = await this.classRepo.findClass({
      where: { id, isDeleted: false },
    });

    if (!found) throw new NotFoundException('Class not found');
    return found;
  }

  async updateClass(id: string, dto: UpdateClassDto) {
    const existing = await this.classRepo.findClass({ where: { id, isDeleted: false } });
    if (!existing) throw new NotFoundException('Class not found');

    const updated = await this.classRepo.updateClass({
      where: { id },
      data: { ...dto },
    });

    return { message: 'Class updated successfully', data: updated };
  }

  async softDeleteClass(id: string) {
    const existing = await this.classRepo.findClass({ where: { id, isDeleted: false } });
    if (!existing) throw new NotFoundException('Class not found');

    await this.classRepo.softDelete(id);
    return { message: 'Class deleted successfully' };
  }
}
