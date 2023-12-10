import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Class } from './schema/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesService } from './classes.service';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @Get('/')
  async getAllClasses(@Request() req: any) {
    const userId = req.user.sub;
    return await this.classesService.getClasses(userId, null);
  }
  @Get('teaching')
  async getTeachingClasses(@Request() req: any) {
    const userId = req.user.sub;
    const teachers = await this.classesService.getClasses(userId, 'teacher');
    return teachers;
  }
  @Get('enrolled')
  async getEnrolledClasses(@Request() req: any) {
    const userId = req.user.sub;
    const students = await this.classesService.getClasses(userId, 'student');
    return students;
  }
  @Post('create')
  async createNewClass(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true })) userData: CreateClassDto,
  ): Promise<Class> {
    const userId = req.user.sub;
    return this.classesService.create(userData, userId);
  }
  @Get('info/:classId')
  async getClassInfo(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.classesService.getClassInfo(userId, classId);
  }
  @Post('update/:classId')
  async update(
    @Request() req: any,
    @Param('classId') classId: string,
    @Body(new ValidationPipe({ transform: true })) userData: UpdateClassDto,
  ) {
    const userId = req.user.sub;
    return this.classesService.update(userId, classId, userData);
  }
  @Get('class-code/:classCode')
  async getClassByClassCode(
    @Request() req: any,
    @Param('classCode') classCode: string,
  ) {
    const userId = req.user.sub;
    //Kiểm tra người dùng đã có trong lớp hay chưa?
    const classInfo = await this.classesService.findClassByClassCode(classCode);
    const enrolled = await this.classesService.getClassInfo(
      userId,
      classInfo['_id'],
    );
    return {
      classInfo,
      joined: enrolled['_id'] && enrolled ? true : false,
    };
  }
  @Post('class-code/:classCode')
  async joinClassByClassCode(
    @Request() req: any,
    @Param('classCode') classCode: string,
  ) {
    const userId = req.user.sub;
    //Kiểm tra người dùng đã có trong lớp hay chưa?
    const classInfo = await this.classesService.findClassByClassCode(classCode);
    const enrolled = await this.classesService.getClassInfo(
      userId,
      classInfo['_id'],
    );
    console.log('enrolled ===== :', enrolled);
    if (!enrolled['_id'] && enrolled['response'] === 'Forbidden') {
      //Người dùng chưa có trong lớp
      try {
        const newEnrollment = await this.classesService.addEnrollment(
          classInfo['_id'],
          userId,
        );
        console.log('Thêm mới : newEnrollment: ', newEnrollment);
        return {
          classInfo,
          joined: true,
        };
      } catch (error) {
        return {
          classInfo,
          joined: false,
        };
      }
    } else {
      return {
        classInfo,
        joined: true,
      };
    }
  }
}
