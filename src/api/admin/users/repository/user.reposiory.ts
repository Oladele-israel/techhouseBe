import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "@/api/db/prismaService"
import { Prisma, User } from "@prisma/client";


@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(query: Prisma.UserCreateArgs) {
        return this.prisma.user.create(query);
    }

    async findUser(query: Prisma.UserFindFirstArgs) {
        return this.prisma.user.findFirst(query);
    }

    async findMany(query: Prisma.UserFindManyArgs){
        return this.prisma.user.findMany(query)
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }
}
