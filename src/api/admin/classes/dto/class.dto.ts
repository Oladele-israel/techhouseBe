import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ClassType } from '@prisma/client';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(ClassType)
  classType: ClassType;
}


export class UpdateClassDto {
  @IsOptional()
  @IsString()
  name?: string;
}