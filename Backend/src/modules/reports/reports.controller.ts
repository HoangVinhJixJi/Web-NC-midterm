import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { ReportConflictStudentIdDto } from './dto/report-conflict-student-id.dto';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';

@UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
@Roles(Role.User)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}
  @Post('report-conflict-id')
  async reportConflictStudentId(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    userData: ReportConflictStudentIdDto,
  ) {
    const userId = req.user.sub;
    return this.reportsService.reportConflictStudentId(
      userId,
      userData.studentId,
      userData.extraInfo,
    );
  }
}
