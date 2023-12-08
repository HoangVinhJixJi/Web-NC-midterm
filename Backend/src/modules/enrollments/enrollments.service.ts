import { Injectable } from '@nestjs/common';
import { Enrollment } from './schema/enrollment.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel('Enrollment') private enrollmentsModel: Model<Enrollment>,
  ) {}

  async findByUserIdAndRole(userId: any, role: string): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsModel
        .find({ userId, role })
        .exec();
      console.log('database: ', enrollments);
      return enrollments;
    } catch (error) {
      throw error;
    }
  }
  async findByClassIdAndRole(
    classId: string,
    role: string,
  ): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsModel
        .find({ classId, role })
        .exec();
      console.log('database: ', enrollments);
      return enrollments;
    } catch (error) {
      throw error;
    }
  }
  async findByUserIdAndClassId(
    userId: any,
    classId: string,
  ): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsModel
        .find({ userId, classId })
        .exec();
      return enrollments;
    } catch (error) {
      throw error;
    }
  }
  async findByUserId(userId: string): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsModel.find({ userId }).exec();
      return enrollments;
    } catch (error) {
      throw error;
    }
  }
  async findByClassId(classId: string): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsModel.find({ classId }).exec();
      return enrollments;
    } catch (error) {
      throw error;
    }
  }
  async getAll(): Promise<Enrollment[]> {
    return await this.enrollmentsModel.find().exec();
  }
}
