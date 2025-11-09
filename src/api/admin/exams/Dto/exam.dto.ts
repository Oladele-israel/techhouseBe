import { IsString, IsNotEmpty, IsOptional, IsArray, IsInt, Min, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRandomExamScheduleDto {
  @ApiProperty({ description: 'Exam ID to schedule' })
  @IsString()
  @IsNotEmpty()
  examId: string;

  @ApiProperty({ description: 'Batch label, e.g., Batch A' })
  @IsString()
  @IsNotEmpty()
  batchLabel: string;

  @ApiProperty({ description: 'Start time of the exam', type: String })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: 'End time of the exam', type: String })
  @IsDateString()
  endTime: string;

  @ApiProperty({ description: 'Duration in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiProperty({ description: 'Number of students to assign', required: true })
  @IsInt()
  @Min(1)
  batchSize: number;

  @ApiProperty({ description: 'Optional class IDs to filter students', required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  classIds?: string[];
}

export class UpdateExamScheduleDto {
  @ApiProperty({ description: 'New start time', required: false })
  @IsOptional()
  @IsDateString()
  startTime?: string;

  @ApiProperty({ description: 'New end time', required: false })
  @IsOptional()
  @IsDateString()
  endTime?: string;

  @ApiProperty({ description: 'New duration in minutes', required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @ApiProperty({ description: 'New status', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Optional batch label update', required: false })
  @IsOptional()
  @IsString()
  batchLabel?: string;
}

export class QueryExamSchedulesDto {
  @ApiProperty({ description: 'Optional exam ID filter', required: false })
  @IsOptional()
  @IsString()
  examId?: string;

  @ApiProperty({ description: 'Optional status filter', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ description: 'Page number', required: false })
  @IsOptional()
  @IsInt()
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false })
  @IsOptional()
  @IsInt()
  perPage?: number;
}
