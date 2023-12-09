import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from './schema/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { Model } from 'mongoose';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel('Class') private classesModel: Model<Class>,
    private enrollmentsService: EnrollmentsService,
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
    await this.enrollmentsService.add(classId, userId, 'teacher', true);
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
  async update(userId: any, classId: any, userData: UpdateClassDto) {
    const { role } = await this.enrollmentsService.getOne(classId, userId);
    return role === 'teacher'
      ? await this.classesModel.findOneAndUpdate(
          { _id: classId },
          { className: userData.className, description: userData.description },
          { new: true },
        )
      : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
