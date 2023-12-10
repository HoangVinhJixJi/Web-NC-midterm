import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
    return await this.classesService.getClasses(userId, null, 'active');
  }
  @Get('teaching')
  async getTeachingClasses(@Request() req: any) {
    const userId = req.user.sub;
    return await this.classesService.getClasses(userId, 'teacher', 'active');
  }
  @Get('enrolled')
  async getEnrolledClasses(@Request() req: any) {
    const userId = req.user.sub;
    return await this.classesService.getClasses(userId, 'student', 'active');
  }
  @Get('archived')
  async getArchivedClasses(@Request() req: any) {
    const userId = req.user.sub;
    return this.classesService.getClasses(userId, null, 'archive');
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
  async getClassInfoAndUserJoinedSatus(
    @Request() req: any,
    @Param('classCode') classCode: string,
  ) {
    const userId = req.user.sub;
    return this.classesService.getClassInfoAndUserJoinedStatus(
      userId,
      classCode,
    );
  }
  @Post('class-code/:classCode')
  async joinClassByClassCodeOrLink(
    @Request() req: any,
    @Param('classCode') classCode: string,
  ) {
    const userId = req.user.sub;
    return this.classesService.joinClass(userId, classCode);
  }
  @Delete('remove-member/:classId')
  async removeMember(
    @Request() req: any,
    @Param('classId') classId: string,
    @Query('rmvId') rmvId: string,
  ) {
    const userId = req.user.sub;
    return this.classesService.removeMember(userId, classId, rmvId);
  }
  @Put('archive/:classId')
  async archiveClass(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.classesService.archive(userId, classId);
  }
  @Put('restore/:classId')
  async restoreClass(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.classesService.restore(userId, classId);
  }
  @Delete('delete/:classId')
  async deleteClass(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.classesService.delete(userId, classId);
  }
  @Delete('leave/:classId')
  async leaveClass(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.classesService.leaveClass(classId, userId);
  }
}
