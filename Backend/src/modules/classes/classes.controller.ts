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
import { Class } from './schema/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesService } from './classes.service';

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
}
