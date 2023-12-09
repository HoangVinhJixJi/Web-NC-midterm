import { HttpStatus, HttpException, Injectable } from '@nestjs/common';
import { Class } from './schema/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingInvitesService } from '../pendingInvites/pendingInvites.service';
import { PendingInvite } from '../pendingInvites/schema/pendingInvite.schema';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { CreateClassDto } from './dto/create-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private pendingInvitesService: PendingInvitesService,
    private enrollmentsService: EnrollmentsService,
    @InjectModel('Class') private classesModel: Model<Class>,
  ) {}
  async create(userData: CreateClassDto, userId: any): Promise<Class> {
    const newClassData = {
      className: userData.className,
      classCode: uuidv4(),
      description: userData.description,
      status: '',
      createAt: new Date().toString(),
    };
    const createClass = new this.classesModel(newClassData);
    const newClass = await createClass.save();
    const classId = newClass._id.toString();
    await this.enrollmentsService.add(classId, userId, 'teacher');
    return newClass;
  }
  async getClasses(userId: any, roll: any) {
    try {
      const enrollments =
        await this.enrollmentsService.getEnrollmentsPopulatedUser(
          userId,
          'classId',
          roll,
        );
      return enrollments.map((enrollment) => enrollment['classId']);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getClassInfo(userId: any, classId: string) {
    const { role } = await this.enrollmentsService.getOne(classId, userId);
    const _class = await this.classesModel.findOne({ _id: classId }).exec();
    return role === 'teacher'
      ? _class
      : { className: _class.className, description: _class.description };
  }
  async getAll(): Promise<Class[]> {
    return await this.classesModel.find().exec();
  }
  async findClassesByIds(classIds: any): Promise<Class[]> {
    try {
      // Sử dụng phương thức find và truyền mảng classIds vào
      const classes = await this.classesModel
        .find({ _id: { $in: classIds } })
        .exec();
      return classes;
    } catch (error) {
      throw error;
    }
  }
  async findClassById(classId: any): Promise<Class> {
    try {
      const classes = await this.classesModel.findById({ _id: classId }).exec();
      return classes;
    } catch (error) {
      throw error;
    }
  }
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
