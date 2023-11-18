import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInterface } from './interface/user.interface';
import { User } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private usersModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<UserInterface> {
    const newUser = {
      ...createUserDto,
      ...{ fullName: '', age: 0, gender: '', avatar: '' },
    };
    const createUser = new this.usersModel(newUser);
    return createUser.save();
  }
  async findOne(username: string): Promise<User> {
    return this.usersModel.findOne({ username }).exec();
  }
}
