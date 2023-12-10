import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}
  @UseGuards(JwtAuthGuard)
  @Get('/:classId')
  async getAllMembers(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;

    return this.enrollmentsService.getMembers(userId, classId, null);
  }
  @UseGuards(JwtAuthGuard)
  @Get('teacher/:classId')
  async getAllTeachers(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.enrollmentsService.getMembers(userId, classId, 'teacher');
  }
  @UseGuards(JwtAuthGuard)
  @Get('student/:classId')
  async getAllStudents(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.enrollmentsService.getMembers(userId, classId, 'student');
  }
  @UseGuards(JwtAuthGuard)
  @Get('email/:classId')
  async getAllEmailsByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.enrollmentsService.getEmailsByClassId(classId);
  }
  @UseGuards(JwtAuthGuard)
  @Get(':classId')
  async getAllByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.enrollmentsService.findAllByClassId(classId);
  }
}
