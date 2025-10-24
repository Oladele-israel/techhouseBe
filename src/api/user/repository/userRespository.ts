import { Injectable, UnauthorizedException } from "@nestjs/common"
import { PrismaService } from "@/api/db/prismaService"
import { Prisma, User } from "@prisma/client";


@Injectable()
export class UserRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createUser(query: Prisma.UserCreateArgs) {
        return this.prisma.user.create(query);
    }

    async findById(id: string) {
        return this.prisma.user.findFirst({ where: { id } });
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async updateRefreshTokenHash(userId: string, hash: string | null) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { refreshTokenHash: hash },
        });
    }

}