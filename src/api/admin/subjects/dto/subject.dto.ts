// import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateSubjectDto {
//   @ApiProperty({ example: 'Mathematics', description: 'Name of the subject' })
  @IsString()
  @IsNotEmpty()
  name: string;

//   @ApiProperty({ example: 'MATH101', description: 'Subject code (optional)' })
  @IsOptional()
  @IsString()
  code?: string;

//   @ApiProperty({ example: 'This subject covers algebra, geometry, etc.' })
  @IsOptional()
  @IsString()
  description?: string;

//   @ApiProperty({ example: 'uuid-of-class', description: 'ID of the class this subject belongs to' })
  @IsUUID()
  @IsNotEmpty()
  classId: string;

//   @ApiProperty({ example: ['uuid-of-teacher'], description: 'IDs of teachers to assign (optional)' })
  @IsOptional()
  teacherIds?: string[];
}


export class UpdateSubjectDto {
  @IsOptional()
  @IsUUID()
  classId?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
  
  @IsOptional()
  teacherIds?: string[];

 @IsOptional()
  @IsString()
  code?: string;
}