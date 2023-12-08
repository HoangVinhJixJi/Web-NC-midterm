import { Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { Model } from 'mongoose';
import { Class } from './schema/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClassesService {
  constructor(@InjectModel('Class') private classesModel: Model<Class>) {}
  async create(userData: CreateClassDto): Promise<Class> {
    const newClass = {
      className: userData.className,
      classCode: uuidv4(),
      description: userData.description,
      status: '',
      createAt: new Date().toString(),
    };
    const createClass = new this.classesModel(newClass);
    return createClass.save();
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
}
