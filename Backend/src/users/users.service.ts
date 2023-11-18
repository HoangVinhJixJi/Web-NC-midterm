import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private usersModel: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = {
      ...createUserDto,
      ...{ fullName: '', gender: '', birthday: '', avatar: '' },
    };
    const createUser = new this.usersModel(newUser);
    return createUser.save();
  }
  async findOne(username: string): Promise<User> {
    return this.usersModel.findOne({ username }).exec();
  }
  async findOneAndUpdate(
    username: string,
    newData: UpdateUserDto,
  ): Promise<User> {
    return this.usersModel
      .findOneAndUpdate({ username: username }, newData, { new: true })
      .exec();
  }
}
