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
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';

@UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
@Roles(Role.User)
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
    const checkStudentId = await this.enrollmentsService.checkStudentId(
      userId,
      classId,
    );
    const classInfo = await this.classesService.getClassInfo(userId, classId);
    return {
      checkStudentId,
      classInfo,
    };
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
            false,
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
