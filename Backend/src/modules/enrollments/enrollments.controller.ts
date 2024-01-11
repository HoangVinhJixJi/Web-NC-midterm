import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';
import { Enrollment } from './schema/enrollment.schema';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}
  @Get(':classId')
  async getAllMembers(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.enrollmentsService.getMembers(userId, classId, null);
  }
  @Get('teacher/:classId')
  async getAllTeachers(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.enrollmentsService.getMembers(userId, classId, 'teacher');
  }
  @Get('student/:classId')
  async getAllStudents(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.enrollmentsService.getMembers(userId, classId, 'student');
  }
  @Get('email/:classId')
  async getAllEmailsByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.enrollmentsService.getEmailsByClassId(classId);
  }
  @Get('/class/:classId')
  async getAllByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.enrollmentsService.findAllByClassId(classId);
  }
  @Post('update/studentid/:classId')
  async updateStudentId(
    @Request() req: any,
    @Param('classId') classId: string,
    @Body(new ValidationPipe({ transform: true }))
    studentId: string,
  ): Promise<Enrollment | null> {
    const userId = req.user.sub;
    return this.enrollmentsService.updateStudentId(classId, userId, studentId);
  }
  @Post('update/list')
  async updateListStudentId(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    data: any,
  ): Promise<any[]> {
    return this.enrollmentsService.updateListStudentId(data);
  }
  @Get('get/one/:classId')
  async getOneEnrollment(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    const userId = req.user.sub;
    return this.enrollmentsService.getOne(classId, userId);
  }
}
