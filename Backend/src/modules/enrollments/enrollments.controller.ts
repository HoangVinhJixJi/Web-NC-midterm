import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

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
}
