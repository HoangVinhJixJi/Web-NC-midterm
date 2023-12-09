import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}
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
}
