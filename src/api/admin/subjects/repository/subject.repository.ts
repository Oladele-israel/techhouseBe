import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '@/api/db/prismaService';

@Injectable()
export class SubjectRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createSubject(query: Prisma.SubjectCreateArgs) {
    return this.prisma.subject.create(query);
  }

  async findSubject(query: Prisma.SubjectFindFirstArgs) {
    return this.prisma.subject.findFirst(query);
  }

  async findMany(query: Prisma.SubjectFindManyArgs) {
    return this.prisma.subject.findMany(query);
  }

  async updateSubject(query: Prisma.SubjectUpdateArgs) {
    return this.prisma.subject.update(query);
  }

  async softDelete(id: string) {
    return this.prisma.subject.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
