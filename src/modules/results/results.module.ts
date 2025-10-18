import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ResultsService } from "./results.service"
import { ResultsController } from "./results.controller"
import { StudentExam } from "./entities/student-exam.entity"
import { StudentAnswer } from "./entities/student-answer.entity"

@Module({
  imports: [TypeOrmModule.forFeature([StudentExam, StudentAnswer])],
  providers: [ResultsService],
  controllers: [ResultsController],
  exports: [ResultsService],
})
export class ResultsModule {}
