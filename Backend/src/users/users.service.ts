import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './interface/user.interface';

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
  async findOneAndUpdate(
    username: string,
    newData: UpdateUserDto,
  ): Promise<User> {
    return this.usersModel
      .findOneAndUpdate({ username: username }, newData, { new: true })
      .exec();
  }
  async updatePassword(username: string, newPassword: string): Promise<string> {
    return this.usersModel.findOneAndUpdate(
      { username: username },
      { password: newPassword },
      { new: true },
    );
  }
  async updateUserByField(
    userId: string,
    updatedFields: Record<string, any>,
  ): Promise<User> {
    try {
      const user = await this.usersModel.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      Object.keys(updatedFields).forEach((key) => {
        user[key] = updatedFields[key];
      });
      await user.save();
      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }
  async createUserFromGoogleUser(ggUser: any): Promise<User> {
    try {
      const user = new this.usersModel(ggUser);
      return await user.save();
    } catch (error) {
      console.error('Error creating google user:', error);
      throw error;
    }
  }
}
