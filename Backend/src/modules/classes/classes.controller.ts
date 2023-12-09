import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
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
    return await this.classesService.getClasses(userId, 'teacher');
  }
  @Get('enrolled')
  async getEnrolledClasses(@Request() req: any) {
    const userId = req.user.sub;
    return await this.classesService.getClasses(userId, 'student');
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
  @Get(':classId')
  async joinClass(
    @Request() req: any,
    @Param('classId') classId: string,
    @Query('cjc') classCode: string,
  ) {
    const userId = req.user.sub;
    return this.classesService.joinClass(userId, classId, classCode);
  }
}
