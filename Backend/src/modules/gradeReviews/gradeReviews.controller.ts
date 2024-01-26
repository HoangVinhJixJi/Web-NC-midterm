import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GradeReviewsService } from './gradeReviews.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { GradeReview } from './schema/gradeReview.schema';
import { AddGradeReviewDto } from './dto/add-gradeReview.dto';
import { UpdateGradeReviewDto } from './dto/update-gradeReview.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Roles(Role.User)
@Controller('gradeReviews')
export class GradeReviewsController {
  constructor(private readonly gradeReviewsService: GradeReviewsService) {}
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('classId/:classId')
  async getAllByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.gradeReviewsService.findAllByClassId(classId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('assignmentId/:assignmentId')
  async getAllByAssignmentId(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.gradeReviewsService.findAllByAssignmentId(assignmentId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('gradeReviewId/:gradeReviewId')
  async getOneByGradeReviewId(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
  ) {
    return this.gradeReviewsService.findOneById(gradeReviewId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('studentId/:studentId')
  async getAllByStudentId(
    @Request() req: any,
    @Param('studentId') studentId: string,
  ) {
    return this.gradeReviewsService.findAllByStudentId(studentId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
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
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Post('add/:classId/:assignmentId')
  async addGradeReview(
    @Request() req: any,
    @Param('classId') classId: string,
    @Param('assignmentId') assignmentId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: AddGradeReviewDto,
  ): Promise<GradeReview> {
    const userId = req.user.sub;
    return this.gradeReviewsService.add(
      userId,
      classId,
      assignmentId,
      userData,
    );
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Delete('remove/:gradeReviewId')
  async removeGradeReview(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
  ) {
    return this.gradeReviewsService.delete(gradeReviewId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Post('update/:gradeReviewId')
  async updateGradeReview(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: UpdateGradeReviewDto,
  ) {
    const userId = req.user.sub;
    return this.gradeReviewsService.findOneAndUpdate(
      userId,
      gradeReviewId,
      userData,
    );
  }
}
