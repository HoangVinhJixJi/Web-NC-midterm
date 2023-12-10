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
  async getClasses(userId: any, role: any) {
    try {
      const enrollments =
        await this.enrollmentsService.getEnrollmentsPopulatedUser(
          userId,
          'classId',
          role,
        );
      return enrollments.map((enrollment) => enrollment['classId']);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getClassInfo(userId: any, classId: string) {
    const user = await this.enrollmentsService.getOne(classId, userId);
    const _class = await this.classesModel.findOne({ _id: classId }).exec();
    return user !== null
      ? user.role === 'teacher'
        ? _class
        : { className: _class.className, description: _class.description }
      : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async update(userId: any, classId: any, userData: UpdateClassDto) {
    const user = await this.enrollmentsService.getOne(classId, userId);
    return user !== null
      ? user.role === 'teacher'
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
  async findClassByClassCode(classCode: any): Promise<Class> {
    try {
      const classes = await this.classesModel.findOne({ classCode }).exec();
      return classes;
    } catch (error) {
      throw error;
    }
  }
  async addEnrollment(clasId: string, userId: string) {
    try {
      const newEnrollment = await this.enrollmentsService.add(
        clasId,
        userId,
        'student',
        false,
      );
      return newEnrollment;
    } catch (error) {
      throw error;
    }
  }
}
