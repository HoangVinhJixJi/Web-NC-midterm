import {
  Body,
  Controller,
  Get,
  Post,
  Param,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { ClassesService } from './classes.service';
import { InviteEmailsDto } from './dto/invite-emails.dto';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { PendingInvitesService } from '../pendingInvites/pendingInvites.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Class } from './schema/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly pendingInvitesService: PendingInvitesService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get('/')
  async getAllClasses(@Request() req: any) {
    const userId = req.user.sub;
    return await this.classesService.getClasses(userId, null);
  }
  @UseGuards(JwtAuthGuard)
  @Get('teaching')
  async getTeachingClasses(@Request() req: any) {
    const userId = req.user.sub;
    const teachers = await this.classesService.getClasses(userId, 'teacher');
    return teachers;
  }
  @UseGuards(JwtAuthGuard)
  @Get('enrolled')
  async getEnrolledClasses(@Request() req: any) {
    const userId = req.user.sub;
    const students = await this.classesService.getClasses(userId, 'student');
    return students;
  }
  @UseGuards(JwtAuthGuard)
  @Post('create')
  async createNewClass(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true })) userData: CreateClassDto,
  ): Promise<Class> {
    const userId = req.user.sub;
    return this.classesService.create(userData, userId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('info/:classId')
  async getClassInfo(@Request() req: any, @Param('classId') classId: string) {
    const userId = req.user.sub;
    return this.classesService.getClassInfo(userId, classId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('update/:classId')
  async update(
    @Request() req: any,
    @Param('classId') classId: string,
    @Body(new ValidationPipe({ transform: true })) userData: UpdateClassDto,
  ) {
    const userId = req.user.sub;
    return this.classesService.update(userId, classId, userData);
  }
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  @Get('email/:classId')
  async getAllEmailsByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    const [enrollmentEmails, pendingInviteEmails] = await Promise.all([
      this.enrollmentsService.getEmailsByClassId(classId),
      this.pendingInvitesService.getEmailsByClassId(classId),
    ]);

    const uniqueEmails = Array.from(
      new Set([...enrollmentEmails, ...pendingInviteEmails]),
    );

    return uniqueEmails;
  }
  @UseGuards(JwtAuthGuard)
  @Post('invite-email/:classId')
  async inviteEmail(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true })) userData: InviteEmailsDto,
    @Param('classId') classId: string,
  ) {
    console.log('userData', userData);
    const pendingInvite = await this.pendingInvitesService.add(
      classId,
      userData.invitedEmail,
      userData.role,
    );
    console.log('pendingInvite', pendingInvite);
    const pendingInviteInfo = await this.classesService.inviteEmail(
      classId,
      userData.invitedEmail,
      userData.role,
      userData.userEmail,
    );
    await this.classesService.sendInvitationEmail(pendingInviteInfo);
    return pendingInviteInfo.receiver;
  }
  @Get('join-invite-email/:inviteToken')
  async handleInvitationLinkClick(
    @Param('inviteToken') inviteToken: string,
    @Res() res: any,
  ) {
    const pendingInviteInfo =
      await this.pendingInvitesService.extractToken(inviteToken);
    if (pendingInviteInfo) {
      const check = await this.enrollmentsService.hasEmailJoinedClass(
        pendingInviteInfo.email,
        pendingInviteInfo.classId,
      );
      if (check) {
        const deletePendingInvite = await this.pendingInvitesService.delete(
          pendingInviteInfo.classId,
          pendingInviteInfo.email,
          pendingInviteInfo.role,
        );
        console.log(deletePendingInvite);
        res.redirect(
          `${this.configService.get<string>(
            'client_url',
          )}/classroom/class-detail/${pendingInviteInfo.classId}`,
        );
      } else {
        const u = await this.usersService.findOneByEmail(
          pendingInviteInfo.email,
        );
        if (u) {
          const enrollment = await this.enrollmentsService.add(
            pendingInviteInfo.classId,
            u._id,
            pendingInviteInfo.role,
          );
          const deletePendingInvite = await this.pendingInvitesService.delete(
            pendingInviteInfo.classId,
            pendingInviteInfo.email,
            pendingInviteInfo.role,
          );
          console.log(enrollment);
          console.log(deletePendingInvite);
          res.redirect(
            `${this.configService.get<string>(
              'client_url',
            )}/classroom/class-detail/${pendingInviteInfo.classId}`,
          );
        } else {
          const pendingInvite =
            await this.pendingInvitesService.findByClassIdAndEmailAndRole(
              pendingInviteInfo.classId,
              pendingInviteInfo.email,
              pendingInviteInfo.role,
            );
          res.redirect(
            `${this.configService.get<string>('client_url')}/signup/${
              pendingInvite._id
            }`,
          );
        }
      }
    } else {
      res.render('invitation-expired');
    }
  }
}
