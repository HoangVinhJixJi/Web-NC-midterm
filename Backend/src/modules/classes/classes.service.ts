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
}
