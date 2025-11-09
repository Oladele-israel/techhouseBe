import { Gender } from "@prisma/client";
import { ArrayNotEmpty, IsArray, IsDateString, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateTeacherDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    subjectIds: string[];

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID('4', { each: true })
    classIds: string[];

    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;

    @IsDateString() 
    @IsNotEmpty()   
    dob: string;

    @IsString()
    address: string;
}


export class UpdateTeacherDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsArray()
    subjectIds?: string[];

    @IsOptional()
    @IsArray()
    classIds?: string[];
}

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsUUID()
    classId: string;

    @IsOptional()
    @IsEnum(Gender)
    gender: Gender;

    @IsDateString() 
    @IsNotEmpty()   
    dob: string;

    @IsString()
    address: string;
}

export class UpdateStudentDto {
    @IsOptional()
    @IsString()
    firstName?: string;

    @IsOptional()
    @IsString()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsUUID()
    classId?: string;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsDateString()
    dob?: string;

    @IsOptional()
    @IsString()
    address?: string;
}