import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { Model } from 'mongoose';
import { Class } from './schema/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { EnrollmentsService } from '../enrollments/enrollments.service';

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
    await this.enrollmentsService.add(classId, userId, 'teacher');
    return newClass;
  }
}
