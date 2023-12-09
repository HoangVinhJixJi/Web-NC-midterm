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
  async getEnrollmentsPopulatedClass(
    classId: string,
    populate: string,
    notEqual: any,
    role: string,
    select: string,
  ) {
    try {
      return role !== null
        ? select !== ''
          ? await this.enrollmentsModel
              .find({ classId, role, userId: { $ne: notEqual } })
              .populate({ path: populate, select: select })
          : await this.enrollmentsModel
              .find({ classId, role, userId: { $ne: notEqual } })
              .populate(populate)
        : select !== ''
          ? await this.enrollmentsModel
              .find({ classId, userId: { $ne: notEqual } })
              .populate({ path: populate, select: select })
          : await this.enrollmentsModel
              .find({ classId, userId: { $ne: notEqual } })
              .populate(populate);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getOne(classId: string, userId: any) {
    return this.enrollmentsModel.findOne({ classId, userId }).exec();
  }
  async getMembers(userId: string, classId: any, _role: string) {
    const member = await this.enrollmentsModel
      .findOne({ userId, classId })
      .exec();
    if (member) {
      try {
        const select =
          member.role === 'teacher'
            ? '_id fullName email avatar'
            : 'fullName avatar';
        const notEqual = member.role === 'student' ? member.userId : null;
        const enrollments = await this.getEnrollmentsPopulatedClass(
          classId,
          'userId',
          notEqual,
          _role,
          select,
        );
        return enrollments.map((enrollment) => {
          return {
            memberInfo: enrollment['userId'],
            role: enrollment.role,
          };
        });
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
