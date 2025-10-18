import { Controller, Get, Post, Param, UseGuards } from "@nestjs/common"
import type { ResultsService } from "./results.service"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"

@Controller("results")
@UseGuards(JwtAuthGuard)
export class ResultsController {
  constructor(private resultsService: ResultsService) {}

  @Post("submit")
  async submitExam(body: any, req) {
    return this.resultsService.submitExam(req.user.id, body.examId, body.answers)
  }

  @Get('student/:studentId')
  async getStudentResults(@Param('studentId') studentId: string) {
    return this.resultsService.getStudentResults(studentId);
  }

  @Get('exam/:examId')
  async getExamResults(@Param('examId') examId: string) {
    return this.resultsService.getExamResults(examId);
  }

  @Get(':studentExamId')
  async getDetailedResult(@Param('studentExamId') studentExamId: string) {
    return this.resultsService.getDetailedResult(studentExamId);
  }
}
