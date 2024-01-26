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
import { GradesService } from './grades.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
// import { ClassesService } from '../classes/classes.service';
// import { EnrollmentsService } from '../enrollments/enrollments.service';
// import { AuthService } from 'src/auth/auth.service';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from '../users/users.service';
import { Grade } from './schema/grade.schema';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Roles(Role.User)
@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // @Get('/')
  // @UseGuards(JwtAuthGuard)
  // async getAllClasses(@Request() req: any) {
  //   const userId = req.user.sub;
  //   return await this.classesService.getClasses(userId, null, 'active');
  // }

  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('/class/:classId')
  async getAllGradesByClasstId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.gradesService.findAllByClassId(classId);
  }
  @Get('/class/:classId/assignment/:assignmentId')
  async getAllGradesByAssignmentId(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
    @Param('classId') classId: string,
  ) {
    return this.gradesService.findAllByAssignmentId(classId, assignmentId);
  }
  @Post('/create')
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  async createNewGrade(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    gradeData: CreateGradeDto,
  ): Promise<Grade> {
    const newGrade = await this.gradesService.create(gradeData);
    console.log('create grade: ', newGrade);
    return newGrade;
  }
  @Post('/create/assignment')
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  async createNewGradeAssignment(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    gradeData: any,
  ): Promise<Grade[]> {
    const newGrade = await this.gradesService.updateGradeAssignment(gradeData);
    return newGrade;
  }
  @Post('/delete')
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  async deleteGrade(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    data: any,
  ): Promise<any> {
    const classId = data.classId;
    const assignmentId = data.assignmentId;
    const studentId = data.studentId;
    const deletedGrade = await this.gradesService.deleteGrade(
      classId,
      assignmentId,
      studentId,
    );
    console.log(deletedGrade);
    return deletedGrade;
  }
  //Public điểm số của 1 học sinh
  @Post('/change-status')
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  async changeStatusGrade(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    data: any,
  ): Promise<any> {
    const userId = req.user.sub;
    const updated = await this.gradesService.updateStatusGradeOfStudent(
      userId,
      data,
    );
    return updated;
  }
  //Public điểm số toàn bộ học sinh của 1 bài tập
  @Post('/assignment/change-status')
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  async changeStatusAssignmentGrade(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    data: any,
  ): Promise<any> {
    const userId = req.user.sub;
    const updated = await this.gradesService.updateStatusGradeOfAssignment(
      userId,
      data,
    );
    console.log('/assignment/change-status: => updated: ', updated);
    return updated;
  }
  //Lấy thông tin điểm bài tập của mình
  @Get('/get/my-grade/:classId/:assignmentId')
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  async getMyGrade(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
    @Param('classId') classId: string,
  ): Promise<any> {
    const userId = req.user.sub;
    const mygrade = await this.gradesService.findMyGrade(
      userId,
      classId,
      assignmentId,
    );
    return mygrade;
  }
  //Update studentId
  @Post('/update/studentid')
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  async updateStudentIdGrade(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    data: any,
  ): Promise<any> {
    //const userId = req.user.sub;
    const updated = await this.gradesService.updateStudentIdsGrade(data);
    console.log('/update/studentid: => updated: ', updated);
    return updated;
  }
}
