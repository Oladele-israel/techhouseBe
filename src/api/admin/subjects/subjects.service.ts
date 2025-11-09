import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { SubjectRepository } from './repository/subject.repository';
import { CreateSubjectDto, UpdateSubjectDto } from './dto/subject.dto';
import { PrismaService } from '@/api/db/prismaService';

@Injectable()
export class SubjectsService {
    constructor(
        private readonly subjectRepo: SubjectRepository,
        private readonly prisma: PrismaService,
    ) { }

    async createSubject(dto: CreateSubjectDto) {
        const cls = await this.prisma.class.findUnique({
            where: { id: dto.classId, isDeleted: false },
        });
        if (!cls) throw new NotFoundException('Class not found');

        const existing = await this.subjectRepo.findSubject({
            where: {
                name: dto.name,
                classId: dto.classId,
                isDeleted: false,
            },
        });
        if (existing)
            throw new BadRequestException('Subject already exists in this class');

        if (dto.teacherIds && dto.teacherIds.length > 0) {
            const teachers = await this.prisma.teacherProfile.findMany({
                where: { id: { in: dto.teacherIds } },
            });
            if (teachers.length !== dto.teacherIds.length)
                throw new BadRequestException('One or more teachers not found');
        }

        const created = await this.subjectRepo.createSubject({
            data: {
                name: dto.name,
                code: dto.code,
                description: dto.description,
                class: { connect: { id: dto.classId } },
                teachers: dto.teacherIds
                    ? { connect: dto.teacherIds.map((id) => ({ id })) }
                    : undefined,
            },
            include: {
                class: true,
                teachers: true,
            },
        });

        return {
            message: 'Subject created successfully',
            data: created,
        };
    }

    async getAllSubjects(classId?: string) {
        const subjects = await this.subjectRepo.findMany({
            where: { isDeleted: false, ...(classId ? { classId } : {}) },
            include: { class: true, teachers: true },
            orderBy: { createdAt: 'desc' },
        });
        return { total: subjects.length, data: subjects };
    }

    async getSubjectById(id: string) {
        const subject = await this.subjectRepo.findSubject({
            where: { id, isDeleted: false },
            include: { class: true, teachers: true },
        });
        if (!subject) throw new NotFoundException('Subject not found');
        return subject;
    }

    async updateSubject(id: string, dto: UpdateSubjectDto) {
        const existing = await this.subjectRepo.findSubject({
            where: { id, isDeleted: false },
        });
        if (!existing) throw new NotFoundException('Subject not found');

        // Update with relational sync (teachers/class)
        const updated = await this.subjectRepo.updateSubject({
            where: { id },
            data: {
                name: dto.name,
                code: dto.code,
                description: dto.description,
                ...(dto.classId ? { class: { connect: { id: dto.classId } } } : {}),
                ...(dto.teacherIds
                    ? { teachers: { set: dto.teacherIds.map((id) => ({ id })) } }
                    : {}),
            },
            include: { class: true, teachers: true },
        });

        return { message: 'Subject updated successfully', data: updated };
    }

    async softDeleteSubject(id: string) {
        const existing = await this.subjectRepo.findSubject({
            where: { id, isDeleted: false },
        });
        if (!existing) throw new NotFoundException('Subject not found');

        await this.subjectRepo.softDelete(id);
        return { message: 'Subject deleted successfully' };
    }
}
