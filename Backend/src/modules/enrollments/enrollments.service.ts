import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './schema/enrollment.schema';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel('Enrollment') private enrollmentsModel: Model<Enrollment>,
  ) {}
  async add(classId: string, userId: string, role: string, isCreator: boolean) {
    const newEnrollment = {
      classId,
      userId,
      role,
      joinAt: new Date().toString(),
      isCreator,
    };
    const createEnrollment = new this.enrollmentsModel(newEnrollment);
    return createEnrollment.save();
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
