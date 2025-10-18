import { IsString, IsNumber, IsDate, IsUUID } from "class-validator"
import { Type } from "class-transformer"

export class CreateExamDto {
  @IsString()
  title: string

  @IsString()
  description?: string

  @IsUUID()
  subjectId: string

  @IsNumber()
  duration: number // in minutes

  @IsNumber()
  totalQuestions: number

  @IsDate()
  @Type(() => Date)
  startTime: Date

  @IsDate()
  @Type(() => Date)
  endTime: Date

  @IsNumber()
  passingScore: number
}
