import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserInterface } from './interface/user.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private usersModel: Model<User>) {}
  async create(newUserData: UserInterface): Promise<User> {
    const createUser = new this.usersModel(newUserData);
    return createUser.save();
  }
  async findOneByUsername(username: string): Promise<User> {
    return this.usersModel.findOne({ username }).exec();
  }
  async findOneByEmail(email: string): Promise<User> {
    return this.usersModel.findOne({ email }).exec();
  }
  async isExistedUser(username: string, email: string): Promise<string | null> {
    const existingUserByUsername = await this.findOneByUsername(username);
    if (existingUserByUsername) {
      return 'Username already exists';
    }
    const existingUserByEmail = await this.findOneByEmail(email);
    if (existingUserByEmail) {
      return 'Email has been registered to another account';
    }
    return null;
  }
  async findOneAndUpdate(username: string, newData: any): Promise<User> {
    return this.usersModel
      .findOneAndUpdate({ username: username }, newData, { new: true })
      .exec();
  }
  async findByActivationToken(token: string): Promise<User> {
    return this.usersModel.findOne({ activationToken: token }).exec();
  }
  async updatePassword(username: string, newPassword: string): Promise<string> {
    return this.usersModel.findOneAndUpdate(
      { username: username },
      { password: newPassword },
      { new: true },
    );
  }
  async updateActivatedUser(user: User) {
    await this.usersModel.findOneAndUpdate(
      { username: user.username },
      { isActivated: user.isActivated, activationToken: user.activationToken },
      { new: true },
    );
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
