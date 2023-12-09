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

@Controller('classes')
// @UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(
    private readonly classesService: ClassesService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly pendingInvitesService: PendingInvitesService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}
  @Post('invite-email/:classId')
  async inviteEmail(
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
    await this.classesService.sendInvitaionEmail(pendingInviteInfo);
    return pendingInviteInfo.receiver;
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
  @Get('join-invite-email/:inviteToken')
  async goToResetPasswordPage(
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
          `${this.configService.get<string>('client_url')}/c/${
            pendingInviteInfo.classId
          }`,
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
        } else {
          const pendingInvite =
            await this.pendingInvitesService.findByClassIdAndEmailAndRole(
              pendingInviteInfo.classId,
              pendingInviteInfo.userId,
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
