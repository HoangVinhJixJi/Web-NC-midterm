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
      status: 'active',
      createAt: new Date().toString(),
    };
    const createClass = new this.classesModel(newClassData);
    const newClass = await createClass.save();
    const classId = newClass._id.toString();
    await this.enrollmentsService.add(classId, userId, 'teacher', true);
    return newClass;
  }
  async getClasses(userId: any, role: any) {
    try {
      const enrollments =
        await this.enrollmentsService.getEnrollmentsPopulatedUser(
          userId,
          'classId',
          role,
          'active',
        );
      return enrollments.map((enrollment) => enrollment['classId']);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getClassInfo(userId: any, classId: string) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    if (member !== null) {
      const _class = await this.classesModel.findOne({ _id: classId }).exec();
      return member.role === 'teacher'
        ? _class
        : { className: _class.className, description: _class.description };
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async update(userId: any, classId: any, userData: UpdateClassDto) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    return member !== null
      ? member.role === 'teacher'
        ? await this.classesModel.findOneAndUpdate(
            { _id: classId },
            {
              className: userData.className,
              description: userData.description,
            },
            { new: true },
          )
        : new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async joinClass(userId: any, classId: string, classCode: string) {
    const _class = await this.classesModel
      .findOne({ _id: classId, classCode })
      .exec();
    if (_class) {
      const member = await this.enrollmentsService.getOne(classId, userId);
      if (!member) {
        return await this.enrollmentsService.add(
          classId,
          userId,
          'student',
          false,
        );
      }
      return member;
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
  async archive(userId: any, classId: string) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    if (member !== null) {
      return member.role === 'teacher'
        ? await this.classesModel.findOneAndUpdate(
            { _id: classId },
            { status: 'archive' },
            { new: true },
          )
        : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
}
