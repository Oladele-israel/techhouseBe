import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/api/db/prismaService';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClassRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createClass(data: Prisma.ClassCreateArgs) {
    return this.prisma.class.create(data);
  }

  async findClass(query: Prisma.ClassFindFirstArgs) {
    return this.prisma.class.findFirst(query);
  }

  async findMany(query: Prisma.ClassFindManyArgs) {
    return this.prisma.class.findMany(query);
  }

  async updateClass(query: Prisma.ClassUpdateArgs) {
    return this.prisma.class.update(query);
  }

  async softDelete(id: string) {
    return this.prisma.class.update({
      where: { id },
      data: { isDeleted: true, deletedAt: new Date() },
    });
  }
}
