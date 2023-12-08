import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './schema/enrollment.schema';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel('Enrollment') private enrollmentsModel: Model<Enrollment>,
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
}
