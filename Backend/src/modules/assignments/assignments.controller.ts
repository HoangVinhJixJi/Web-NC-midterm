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
import { AssignmentsService } from './assignments.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
// import { ClassesService } from '../classes/classes.service';
// import { EnrollmentsService } from '../enrollments/enrollments.service';
// import { AuthService } from 'src/auth/auth.service';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from '../users/users.service';
import { Assignment } from './schema/assignment.schema';
import { CreateAssignmentDto } from './dto/create-assigment.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Roles(Role.User)
@UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
@Controller('assignments')
export class AssignmentsController {
  constructor(private readonly assignemntsService: AssignmentsService) {}

  // @Get('/')
  // @UseGuards(JwtAuthGuard)
  // async getAllClasses(@Request() req: any) {
  //   const userId = req.user.sub;
  //   return await this.classesService.getClasses(userId, null, 'active');
  // }

  @Get('/:classId')
  async getAllAssignmentsByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.assignemntsService.findAllByClassId(classId);
  }
  @Get('/get/assignment/:assignmentId')
  async getAssignmentsByAssignmentId(
    @Request() req: any,
    @Param('assignmentId') assignmentId: string,
  ) {
    return this.assignemntsService.findOneById(assignmentId);
  }
  @Post('create')
  async createNewAssignment(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    assignmentData: CreateAssignmentDto,
  ): Promise<Assignment> {
    //const userId = req.user.sub;
    return this.assignemntsService.create(assignmentData);
  }
  @Post('update')
  @UseGuards(JwtAuthGuard)
  async updateNewAssignment(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    assignmentData: any,
  ): Promise<Assignment> {
    //const userId = req.user.sub;
    return await this.assignemntsService.findOneAndUpdate(assignmentData);
  }
}
