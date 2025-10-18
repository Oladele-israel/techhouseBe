import { IsString, IsArray, IsUUID, IsNumber } from "class-validator"

export class CreateQuestionDto {
  @IsString()
  text: string

  @IsArray()
  options: string[]

  @IsNumber()
  correctOptionIndex: number

  @IsString()
  explanation?: string

  @IsUUID()
  examId: string
}
