import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './schema/enrollment.schema';
import { User } from '../users/schema/user.schema';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel('Enrollment') private enrollmentsModel: Model<Enrollment>,
    @InjectModel('User') private usersModel: Model<User>,
  ) {}
  async add(classId: string, userId: string, role: string) {
    const newEnrollment = {
      classId,
      userId,
      role,
      joinAt: new Date().toString(),
    };
    const createEnrollment = new this.enrollmentsModel(newEnrollment);
    return createEnrollment.save();
  }
  async findAllByClassId(classId: string): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsModel.find({ classId }).exec();
      return enrollments;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEmailsByClassId(classId: string): Promise<string[]> {
    try {
      const enrollments = await this.enrollmentsModel.find({ classId }).exec();

      // Lấy userIds từ enrollments
      const userIds = enrollments.map((enrollment) => enrollment.userId);

      // Lấy emails từ bảng Users
      const users = await this.usersModel
        .find({ _id: { $in: userIds } })
        .exec();
      const emails = users.map((user) => user.email);

      return emails;
    } catch (error) {
      throw new Error(error);
    }
  }
  async hasEmailJoinedClass(email: string, classId: string): Promise<boolean> {
    try {
      const enrolledEmails = await this.getEmailsByClassId(classId);
      return enrolledEmails.includes(email);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEnrollmentsPopulatedUser(
    userId: string,
    populate: string,
    role: string,
  ) {
    try {
      return role !== null
        ? await this.enrollmentsModel.find({ userId, role }).populate(populate)
        : await this.enrollmentsModel.find({ userId }).populate(populate);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getOne(classId: string, userId: any) {
    return this.enrollmentsModel.findOne({ classId, userId }).exec();
  }
  async getMembers(userId: string, classId: any, _role: string) {
    const { role } = await this.enrollmentsModel
      .findOne({ userId, classId })
      .exec();
    switch (_role) {
      case 'teacher':
        return role === 'teacher'
          ? await this.enrollmentsModel
              .find({ classId, userId, role: _role })
              .exec()
          : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      case 'student':
        return role === 'teacher'
          ? await this.enrollmentsModel
              .find({ classId, userId, role: _role })
              .exec()
          : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      default:
        return role === 'teacher'
          ? await this.enrollmentsModel.find({ classId, userId }).exec()
          : await this.enrollmentsModel
              .find({ classId, userId, role: 'teacher' })
              .exec();
    }
  }
}
