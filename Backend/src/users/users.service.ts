import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserInterface } from './interface/user.interface';
import * as bcrypt from 'bcrypt';
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
  async findByResetPasswordToken(resetToken: string) {
    return this.usersModel.findOne({ resetPasswordToken: resetToken }).exec();
  }
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
  //Handle Facebook User
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
  async findByFacebookIdOrEmail(
    facebookId: string,
    email: string,
  ): Promise<User | null> {
    if (email) {
      const existingUser = await this.usersModel.findOne({ email }).exec();
      return existingUser;
    } else if (facebookId) {
      const existingUser = await this.usersModel.findOne({ facebookId }).exec();
      return existingUser;
    } else {
      return null;
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
