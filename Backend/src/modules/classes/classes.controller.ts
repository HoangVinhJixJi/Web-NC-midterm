import {
  Get,
  Body,
  Controller,
  Post,
  UseGuards,
  ValidationPipe,
  Request,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Class } from './schema/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesService } from './classes.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { UsersService } from '../users/users.service';


@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly usersService: UsersService,
  ) {}
  @Post('create')
  async createNewClass(
    @Body(new ValidationPipe({ transform: true })) userData: CreateClassDto,
  ): Promise<Class> {
    return this.classesService.create(userData);
  }
  //Test Call API Class, Enrollment in Frontend
  @Get('all-class')
  async getAllClasses(): Promise<Class[]> {
    return this.classesService.getAll();
  }
  @Get('teaching-classes')
  async getTeachingClasses(@Request() req: any) {
    const role = 'teacher';
    const userId = req.user.sub;
    //console.log('req.user: ', req.user);
    const enrollments = await this.enrollmentsService.findByUserIdAndRole(
      userId,
      role,
    );
    //console.log('enrollments: ', enrollments);
    const ids = enrollments.map((obj) => {
      //console.log('obj.role: ', obj.toObject().classId);
      return obj.toObject().classId;
    });
    //console.log('ids: ', ids);
    const classes = await this.classesService.findClassesByIds(ids);
    //console.log('classes: ', classes);
    return classes;
  }
  @Get('teaching-classes')
  async getJoinedClasses(@Request() req: any) {
    const role = 'student';
    const userId = req.user.sub;
    //console.log('req.user: ', req.user);
    const enrollments = await this.enrollmentsService.findByUserIdAndRole(
      userId,
      role,
    );
    //console.log('enrollments: ', enrollments);
    const ids = enrollments.map((obj) => {
      //console.log('obj.role: ', obj.toObject().classId);
      return obj.toObject().classId;
    });
    //console.log('ids: ', ids);
    const classes = await this.classesService.findClassesByIds(ids);
    //console.log('classes: ', classes);
    return classes;
  }
  @Get('class-detail/:classId')
  async getClassDetail(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    //console.log('req.user: ', req.user);
    const enrollments = await this.enrollmentsService.findByClassId(classId);
    const teacherEnrollments =
      await this.enrollmentsService.findByClassIdAndRole(classId, 'teacher');
    const studentEnrollments =
      await this.enrollmentsService.findByClassIdAndRole(classId, 'student');
    const teacherIds = teacherEnrollments.map((obj) => {
      return obj.toObject().userId;
    });

    const teachers = await this.usersService.findUsersByIds(teacherIds);

    const teacherData = teachers.map((obj) => {
      const data = {
        _id: obj.toObject()._id.toString(),
        fullName: obj.toObject().fullName,
        avatar: obj.toObject().avatar,
      };
      return data;
    });
    console.log('=> enrollments 1: ', teachers);
    const classData = await this.classesService.findClassById(classId);
    classData['teachers'] = teacherData;
    classData['students'] = teacherData; //Example
    console.log('classes 1: ', classData);
    return classData;
  }
}
