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
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';

@UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
@Roles(Role.User)
@Controller('enrollments')
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
  @Get(':classId')
  async getAllByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.enrollmentsService.findAllByClassId(classId);
  }
  @Post('update/:classId')
  async createNewAssignment(
    @Request() req: any,
    @Param('classId') classId: string,
    @Body(new ValidationPipe({ transform: true }))
    studentId: string,
  ): Promise<Enrollment | null> {
    const userId = req.user.sub;
    return this.enrollmentsService.updateStudentId(classId, userId, studentId);
  }
}
