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

@Controller('grades')
export class GradesController {
  constructor(private readonly gradesService: GradesService) {}

  // @Get('/')
  // @UseGuards(JwtAuthGuard)
  // async getAllClasses(@Request() req: any) {
  //   const userId = req.user.sub;
  //   return await this.classesService.getClasses(userId, null, 'active');
  // }

  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async createNewGrade(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    gradeData: CreateGradeDto,
  ): Promise<Grade> {
    const newGrade = await this.gradesService.create(gradeData);
    return newGrade;
  }
  @Post('/create/assignment')
  @UseGuards(JwtAuthGuard)
  async createNewGradeAssignment(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    gradeData: any,
  ): Promise<Grade[]> {
    const newGrade = await this.gradesService.updateGradeAssignment(gradeData);
    return newGrade;
  }
  @Post('/delete')
  @UseGuards(JwtAuthGuard)
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
  @Post('/change-status')
  @UseGuards(JwtAuthGuard)
  async changeStatusGrade(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    data: any,
  ): Promise<any> {
    const updated = await this.gradesService.updateOneGrade('status', data);
    return updated;
  }
}
