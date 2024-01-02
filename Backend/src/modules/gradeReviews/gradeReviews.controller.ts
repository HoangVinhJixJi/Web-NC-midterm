import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GradeReviewsService } from './gradeReviews.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GradeReview } from './schema/gradeReview.schema';
import { AddGradeReviewDto } from './dto/add-gradeReview.dto';
import { UpdateGradeReviewDto } from './dto/update-gradeReview.dto';

@Controller('gradeReviews')
export class GradeReviewsController {
  constructor(private readonly gradeReviewsService: GradeReviewsService) {}
  @UseGuards(JwtAuthGuard)
  @Get(':classId')
  async getAllByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.gradeReviewsService.findAllByClassId(classId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':assignmentId')
  async getAllByAssignmentId(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.gradeReviewsService.findAllByAssignmentId(assignmentId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':gradeReviewId')
  async getAllByGradeReviewId(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
  ) {
    return this.gradeReviewsService.findAllById(gradeReviewId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':studentId')
  async getAllByStudentId(
    @Request() req: any,
    @Param('studentId') studentId: string,
  ) {
    return this.gradeReviewsService.findAllByStudentId(studentId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':classId/:assignmentId/:studentId')
  async getAllByEachStudent(
    @Request() req: any,
    @Param('classId') classId: string,
    @Param('assignmentId') assignmentId: string,
    @Param('studentId') studentId: string,
  ) {
    return this.gradeReviewsService.findAllByEachStudent(
      classId,
      assignmentId,
      studentId,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Post('add/:classId/:assignmentId')
  async addGradeReview(
    @Request() req: any,
    @Param('classId') classId: string,
    @Param('assignmentId') assignmentId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: AddGradeReviewDto,
  ): Promise<GradeReview> {
    return this.gradeReviewsService.add(classId, assignmentId, userData);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('remove/:gradeReviewId')
  async removeGradeReview(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
  ) {
    return this.gradeReviewsService.delete(gradeReviewId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('update/:gradeReviewId')
  async updateGradeReview(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: UpdateGradeReviewDto,
  ) {
    return this.gradeReviewsService.findOneAndUpdate(gradeReviewId, userData);
  }
}
