import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repository/user.reposiory';
import { CreateStudentDto, CreateTeacherDto, UpdateStudentDto, UpdateTeacherDto } from './Dto/users.dto';
import { hash } from '@/utils/security/security';
import { PrismaService } from '@/api/db/prismaService';
import { Role } from '@prisma/client';

@Injectable()
export class UserService {
    constructor(private readonly userRepo: UserRepository,
        private readonly prisma: PrismaService
    ) { }

    public async createTeacher(dto: CreateTeacherDto) {
        const existingTeacher = await this.userRepo.findByEmail(dto.email)
        if (existingTeacher) throw new BadRequestException('Teacher already exist in our records!')
        const hashedPass = await hash(dto.password)

        const subjects = await this.prisma.subject.findMany({
            where: { id: { in: dto.subjectIds } },
        });

        if (subjects.length !== dto.subjectIds.length) {
            throw new BadRequestException('One or more subjects not found!');
        }

        const classes = await this.prisma.class.findMany({
            where: { id: { in: dto.classIds } },
        });

        if (classes.length !== dto.classIds.length) {
            throw new BadRequestException('One or more classes not found!');
        }

        const teacher = await this.prisma.$transaction(async (tx) => {
            const createdTeacher = await tx.user.create({
                data: {
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    email: dto.email,
                    password: hashedPass,
                    role: Role.TEACHER,
                    teacherProfile: {
                        create: {
                            subjects: {
                                connect: dto.subjectIds.map((id) => ({ id })),
                            },
                            classes: {
                                connect: dto.classIds.map((id) => ({ id })),
                            },
                               gender: dto.gender,
                        dateOfBirth: new Date(dto.dob),
                        address: dto.address,
                        },
                    },
                },
                include: {
                    teacherProfile: {
                        include: { subjects: true, classes: true },
                    },
                },
            });

            return createdTeacher;
        });
        // send the user creds to the user email and welcome the user

        const { password, ...safeTeacher } = teacher;
        return {
            message: "Teacher records created successfully!",
            teacher,
        }
    }

    public async getAllTeachers() {

        const teas = await this.userRepo.findMany({
            where: {
                role: Role.TEACHER
            }, include: {
                teacherProfile: true
            }
        })

        const teachers = await this.prisma.user.findMany({
            where: { role: Role.TEACHER },
            include: {
                teacherProfile: {
                    include: {
                        subjects: true,
                        classes: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return {
            message: 'All teachers fetched successfully!',
            count: teachers.length,
            teachers,
        };
    }


    public async getTeacherById(id: string) {
        const teacher = await this.userRepo.findUser({
            where: {
                id
            }, include: {
                teacherProfile: {
                    include: {
                        subjects: true,
                        classes: true
                    }
                }
            }
        })

        if (!teacher || teacher.role !== Role.TEACHER) {
            throw new NotFoundException('Teacher not found');
        }

        const { password, ...safeTeacher } = teacher;
        return {
            message: 'Teacher retrieved successfully!',
            teacher: safeTeacher,
        };
    }

    public async updateTeacher(id: string, dto: UpdateTeacherDto) {
        const teacher = await this.prisma.user.findUnique({
            where: { id },
            include: { teacherProfile: true },
        });

        if (!teacher || teacher.role !== Role.TEACHER) {
            throw new NotFoundException('Teacher not found');
        }

        // Validate subject and class IDs if provided
        if (dto.subjectIds?.length) {
            const subjects = await this.prisma.subject.findMany({
                where: { id: { in: dto.subjectIds } },
            });

            if (subjects.length !== dto.subjectIds.length) {
                throw new BadRequestException('One or more subjects not found!');
            }
        }

        if (dto.classIds?.length) {
            const classes = await this.prisma.class.findMany({
                where: { id: { in: dto.classIds } },
            });

            if (classes.length !== dto.classIds.length) {
                throw new BadRequestException('One or more classes not found!');
            }
        }

        const updatedTeacher = await this.prisma.$transaction(async (tx) => {
            const userUpdate = await tx.user.update({
                where: { id },
                data: {
                    firstName: dto.firstName ?? teacher.firstName,
                    lastName: dto.lastName ?? teacher.lastName,
                    email: dto.email ?? teacher.email,
                },
            });

            if (dto.subjectIds || dto.classIds) {
                await tx.teacherProfile.update({
                    where: { id: teacher.teacherProfile?.id },
                    data: {
                        subjects: dto.subjectIds
                            ? {
                                set: [],
                                connect: dto.subjectIds.map((id) => ({ id })),
                            }
                            : undefined,
                        classes: dto.classIds
                            ? {
                                set: [],
                                connect: dto.classIds.map((id) => ({ id })),
                            }
                            : undefined,
                    },
                });
            }

            return tx.user.findUnique({
                where: { id },
                include: {
                    teacherProfile: {
                        include: { subjects: true, classes: true },
                    },
                },
            });
        });

        return {
            message: 'Teacher updated successfully!',
            teacher: updatedTeacher,
        };
    }

    private generateRegNumber(): string {
        const randomPart = Math.floor(100000 + Math.random() * 900000);
        return `STDNT-${randomPart}`;
    }

    private generatePassword(firstName: string, lastName: string): string {
        const firstPart = firstName.slice(0, 2).toLowerCase();
        const lastPart = lastName.slice(-2).toLowerCase();
        const randomDigits = Math.floor(1000 + Math.random() * 9000);
        return `${firstPart}${lastPart}${randomDigits}`;
    }

    public async createStudent(dto: CreateStudentDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });
        if (existingUser) throw new BadRequestException('Student already exists');

        const plainPassword = this.generatePassword(dto.firstName, dto.lastName);
        const hashedPassword = await hash(plainPassword);
        const regNumber = this.generateRegNumber();

        const student = await this.prisma.user.create({
            data: {
                firstName: dto.firstName,
                lastName: dto.lastName,
                email: dto.email,
                password: hashedPassword,
                role: Role.STUDENT,
                studentProfile: {
                    create: {
                        classId: dto.classId,
                        regNo: regNumber,
                        gender: dto.gender,
                        dateOfBirth: new Date(dto.dob),
                        address: dto.address,
                    },
                },
            },
            include: {
                studentProfile: { include: { class: true } },
            },
        });

        // At this point, you could integrate a mail service
        // to send the `plainPassword` to the student's email.

        const { password, ...safeStudent } = student;
        return {
            message: 'Student registered successfully!',
            student: safeStudent,
            credentials: {
                email: student.email,
                password: plainPassword,
            },
        };
    }

    public async updateStudent(id: string, dto: UpdateStudentDto) {
        const student = await this.prisma.user.findUnique({
            where: { id },
            include: { studentProfile: true },
        });

        if (!student || student.role !== Role.STUDENT) {
            throw new NotFoundException('Student not found');
        }

        // If classId is provided, verify the class exists
        if (dto.classId) {
            const classExists = await this.prisma.class.findUnique({
                where: { id: dto.classId },
            });
            if (!classExists) {
                throw new BadRequestException('Class not found!');
            }
        }

    //     const updatedStudent = await this.prisma.$transaction(async (tx) => {
    //         // Update user table (basic info)
    //         const updatedUser = await tx.user.update({
    //             where: { id },
    //             data: {
    //                 firstName: dto.firstName ?? student.firstName,
    //                 lastName: dto.lastName ?? student.lastName,
    //                 email: dto.email ?? student.email,
    //             },
    //         });

    //         // Update student profile (class, gender, etc.)
    //         const updatedProfile = await tx.studentProfile.update({
    //             where: { id: student.studentProfile?.id},
    //             data: {
    //                 classId: dto.classId ?? student.studentProfile?.classId,
    //                 dob: dto.dob ? new Date(dto.dob) : student.studentProfile?.dateOfBirth,
    //                 address: dto.address ?? student.studentProfile.address,
    //             },
    //             include: { class: true },
    //         });

    //         return { ...updatedUser, studentProfile: updatedProfile };
    //     });

    //     const { password, ...safeData } = updatedStudent;
    //     return {
    //         message: 'Student profile updated successfully!',
    //         student: safeData,
    //     };
    // }

}
}
