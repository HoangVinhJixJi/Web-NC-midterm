import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles/roles.guard';
import { Roles } from '../../../../auth/roles/roles.decorator';
import { Role } from '../../../../enums/role.enum';
import { ClassService } from './class.service';
import { ArchiveClassDto } from './dto/archive-class.dto';
import { RestoreClassDto } from './dto/restore-class.dto';
import { DeleteClassDto } from './dto/delete-class.dto';
import { AssignStudentIdDto } from './dto/assign-student-id.dto';
import { AssignStudentIdToAllDto } from './dto/assign-student-id-to-all.dto';
import { AccountStatusGuard } from '../../../../auth/account-status/account-status.guard';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;

@UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/management/class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('')
  async getClasses(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('searchTerm') searchTerm: string,
    @Query('status') status: string,
    @Query('action') action: string,
    @Query('sortedBy') sortedBy: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const pageNumber = parseInt(page, 10) || PAGE_NUMBER_DEFAULT;
    const pageSizeNumber = parseInt(pageSize, 10) || PAGE_SIZE_NUMBER_DEFAULT;
    return this.classService.getClasses(
      pageNumber,
      pageSizeNumber,
      searchTerm,
      status,
      action,
      sortedBy,
      sortOrder,
    );
  }
  @Post('archive')
  async archiveClass(
    @Body(new ValidationPipe({ transform: true })) userData: ArchiveClassDto,
  ) {
    return this.classService.archiveClass(userData.classId);
  }
  @Post('restore')
  async restoreClass(
    @Body(new ValidationPipe({ transform: true })) userData: RestoreClassDto,
  ) {
    return this.classService.restoreClass(userData.classId);
  }
  @Post('delete')
  async deleteClass(
    @Body(new ValidationPipe({ transform: true })) userData: DeleteClassDto,
  ) {
    return this.classService.deleteClass(userData.classId);
  }
  @Get('class-info')
  async getClassInfo(@Query('classId') classId: string) {
    return this.classService.getClassInfo(classId);
  }
  @Get('teacher')
  async getClassTeacers(@Query('classId') classId: string) {
    return this.classService.getClassTeachers(classId);
  }
  @Get('student')
  async getClassStudents(@Query('classId') classId: string) {
    return this.classService.getClassStudents(classId);
  }
  @Post('assign-student-id')
  async assignStudentId(
    @Body(new ValidationPipe({ transform: true })) userData: AssignStudentIdDto,
  ) {
    return this.classService.assignStudentId(
      userData.userId,
      userData.classId,
      userData.studentId,
    );
  }
  @Post('assign-student-id-to-all')
  async assignStudentIdToAll(
    @Body(new ValidationPipe({ transform: true }))
    userData: AssignStudentIdToAllDto,
  ) {
    return this.classService.assignStudentIdToAll(
      userData.classId,
      userData.importedData,
    );
  }
}
