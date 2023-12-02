import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserInterface } from './interface/user.interface';
import { CreateFbUserDto } from './dto/create-fb-user.dto';

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
  //Handle Facebook User

  async findByFacebookIdOrEmail(
    facebookId: string,
    email: string,
  ): Promise<User | null> {
    try {
      const existingUser = await this.usersModel
        .findOne({ $or: [{ facebookId }, { email }] })
        .exec();
      return existingUser;
    } catch (error) {
      console.log('Error finding by facebookId or email: ', error);
      throw error;
    }
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
      // Cập nhật các trường mới nếu có
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
  async addFacebookId(userId: string, facebookId: string): Promise<any> {
    return this.usersModel.updateOne(
      { _id: userId },
      { $set: { facebookId: facebookId } },
    );
  }

  async createFacebookUser(createFbUserDto: CreateFbUserDto): Promise<User> {
    try {
      console.log('user FB data: ', createFbUserDto);
      const newUser = new this.usersModel(createFbUserDto);
      console.log('create FB User: ', newUser);
      return await newUser.save();
    } catch (error) {
      console.error('Error creating Facebook user:', error);
      throw error;
    }
  }
}
