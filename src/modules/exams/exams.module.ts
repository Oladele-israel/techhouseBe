import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ExamsService } from "./exams.service"
import { ExamsController } from "./exams.controller"
import { Exam } from "./entities/exam.entity"
import { SubjectsModule } from "../subjects/subjects.module"

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), SubjectsModule],
  providers: [ExamsService],
  controllers: [ExamsController],
  exports: [ExamsService],
})
export class ExamsModule {}
