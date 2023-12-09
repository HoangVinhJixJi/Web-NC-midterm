import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { Class } from './schema/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingInvitesService } from '../pendingInvites/pendingInvites.service';
import { PendingInvite } from '../pendingInvites/schema/pendingInvite.schema';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClassesService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private pendingInvitesService: PendingInvitesService,
    @InjectModel('Class') private classesModel: Model<Class>,
  ) {}
  async findByClassId(classId: string): Promise<Class | null> {
    try {
      return await this.classesModel.findOne({ _id: classId }).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async inviteEmail(
    classId: string,
    email: string,
    role: string,
    userEmail: string,
  ) {
    const pendingInvite =
      await this.pendingInvitesService.findByClassIdAndEmailAndRole(
        classId,
        email,
        role,
      );
    if (pendingInvite) {
      return await this.createInvitationData(pendingInvite, userEmail);
    } else {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
  }
  async createInvitationData(pendingInvite: PendingInvite, userEmail: string) {
    const payload = {
      classId: pendingInvite.classId.toString(),
      email: pendingInvite.email,
      role: pendingInvite.role,
    };
    const invite_token = await this.jwtService.signAsync(payload);
    await this.pendingInvitesService.findOneAndUpdate(
      payload.classId,
      payload.email,
      payload.role,
      {
        inviteToken: invite_token,
      },
    );
    const c = await this.findByClassId(pendingInvite.classId.toString());
    return {
      receiver: pendingInvite.email,
      sender: userEmail,
      className: c.className,
      role: pendingInvite.role,
      invite_token,
    };
  }
  async sendInvitaionEmail(pendingInviteInfo: {
    receiver: string;
    sender: string;
    className: string;
    role: string;
    invite_token: string;
  }) {
    const invitationLink = `${this.configService.get<string>(
      'public_url',
    )}/classes/join-invite-email/${pendingInviteInfo.invite_token}`;
    const mailData = {
      subject: 'Tham gia lớp học',
      to: pendingInviteInfo.receiver,
      template: 'invitation',
      context: {
        receiver: pendingInviteInfo.receiver,
        sender: pendingInviteInfo.sender,
        className: pendingInviteInfo.className,
        role: pendingInviteInfo.role,
        invitationLink: invitationLink,
      },
    };
    await this.mailService.sendEmail(mailData);
  }
}
