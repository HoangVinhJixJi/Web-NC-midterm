import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/user.schema';
import { UserInterface } from './interface/user.interface';
import * as bcrypt from 'bcrypt';
import { CreateFbUserDto } from './dto/create-fb-user.dto';
import { SortOrderEnum } from '../../enums/sort-order.enum';
import { AssignAccountStudentIdDto } from '../admin/management/account/dto/assign-account-student-id.dto';
import { Role } from '../../enums/role.enum';
import { Enrollment } from '../enrollments/schema/enrollment.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel('User') private usersModel: Model<User>,
    @InjectModel('Enrollment') private enrollmentsModel: Model<Enrollment>,
  ) {}
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
    if (facebookId) {
      const existingUser = await this.usersModel.findOne({ facebookId }).exec();
      return existingUser;
    } else if (email) {
      const existingUser = await this.usersModel.findOne({ email }).exec();
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
  async createUserFromGoogleUser(ggUser: any): Promise<User> {
    try {
      const user = new this.usersModel(ggUser);
      return await user.save();
    } catch (error) {
      console.error('Error creating google user:', error);
      throw error;
    }
  }
  async findUsersByIds(userIds: any): Promise<User[]> {
    try {
      // Sử dụng phương thức find và truyền mảng UserIds vào
      const Users = await this.usersModel
        .find({ _id: { $in: userIds } })
        .exec();
      return Users;
    } catch (error) {
      throw error;
    }
  }

  async getUserListByPage(
    param: { take: number; skip: number },
    filter: any = {},
    sort: { sortedBy: string; sortOrder: string },
  ) {
    const total = await this.usersModel.countDocuments(filter);
    if (total === 0 || param.skip >= total) {
      return { totalPages: total, users: [] };
    }
    const totalPages = Math.ceil(total / param.take);
    let sortCondition: any = {};
    switch (sort.sortedBy.toLowerCase()) {
      case 'userid':
        sortCondition = {
          ...sortCondition,
          _id: sort.sortOrder.toLowerCase() === SortOrderEnum.Increase ? 1 : -1,
        };
        break;
      case 'studentid':
        sortCondition = {
          ...sortCondition,
          studentId:
            sort.sortOrder.toLowerCase() === SortOrderEnum.Increase ? 1 : -1,
        };
        break;
      case 'fullname':
        break;
      default:
        sortCondition = { ...sortCondition, _id: 1 };
    }
    if (Object.keys(sortCondition).length !== 0) {
      const users = await this.usersModel
        .find(filter)
        .sort(sortCondition)
        .skip(param.skip)
        .limit(param.take)
        .exec();
      return { totalPages, users };
    } else {
      const users = await this.usersModel.find(filter).exec();
      const sortedUsers = users.sort((a, b) => {
        const lastNameA = a.fullName.split(' ').pop().toLowerCase();
        const lastNameB = b.fullName.split(' ').pop().toLowerCase();
        return sort.sortOrder === SortOrderEnum.Increase
          ? lastNameA.localeCompare(lastNameB)
          : lastNameB.localeCompare(lastNameA);
      });
      return {
        totalPages,
        users: sortedUsers.slice(param.skip, param.skip + param.take),
      };
    }
  }
  async findOneById(userId: any) {
    return this.usersModel.findOne({ _id: userId }).exec();
  }
  async adminAssignStudentId(userId: string, studentId: string) {
    if (studentId !== '') {
      const filter = {
        $and: [{ studentId: studentId }, { _id: { $ne: userId } }],
      };
      const user = await this.usersModel.findOne(filter).exec();
      return !user
        ? this.usersModel
            .findOneAndUpdate(
              { _id: userId },
              { studentId: studentId },
              { new: true },
            )
            .exec()
        : null;
    } else {
      return this.usersModel
        .findOneAndUpdate({ _id: userId }, { studentId: null }, { new: true })
        .exec();
    }
  }
  async adminAssignStudentIds(userData: Array<AssignAccountStudentIdDto>) {
    return Promise.all(
      userData.map(async (user) => {
        console.log(user);
        const assignResuld = await this.adminAssignStudentId(
          user.userId,
          user.studentId,
        );
        console.log(assignResuld);
        return assignResuld
          ? { userId: assignResuld._id, studentId: assignResuld.studentId }
          : { userId: user.userId, studentId: null };
      }),
    );
  }
  async addStudentId(userId: any, studentId: any) {
    const filter = {
      $and: [{ studentId: studentId }, { _id: { $ne: userId } }],
    };
    const isExist = await this.usersModel.findOne(filter);
    if (!isExist) {
      const addedUser = await this.usersModel.findOneAndUpdate(
        { _id: userId },
        { studentId: studentId },
        { new: true },
      );
      await this.enrollmentsModel
        .updateMany(
          { userId: addedUser._id.toString() },
          { studentId: addedUser.studentId },
        )
        .exec();
      return addedUser;
    } else {
      throw new HttpException('Conflict Student ID', HttpStatus.CONFLICT);
    }
  }
  async findUsersByRole(Admin: Role) {
    return this.usersModel.find({ role: Admin }).exec();
  }
  async findUsers(filter: any = {}) {
    return this.usersModel.find(filter).exec();
  }
  async deleteOne(filter: { _id: string }) {
    return this.usersModel.findOneAndDelete(filter).exec();
  }
  async addStudentIdRoleTeacher(userId: any, updateData: any) {
    const classId = updateData.classId;
    console.log(updateData);
    const isCreator = await this.enrollmentsModel
      .findOne({
        classId,
        userId,
        role: 'teacher',
      })
      .exec();
    console.log(isCreator);
    if (isCreator && isCreator['isCreator']) {
      for (const row of updateData.list) {
        // Tìm kiếm enrollment dựa trên classId và userId
        console.log('row: update studentId: ', row);
        const filter = {
          $and: [
            { studentId: row.newStudentId },
            { _id: { $ne: row.studentUserId } },
          ],
        };
        const isExist = await this.usersModel.findOne(filter);
        console.log(isExist);
        if (!isExist) {
          const addedUser = await this.usersModel.findOneAndUpdate(
            { _id: row.studentUserId },
            { studentId: row.newStudentId },
            { new: true },
          );
          console.log('addUser: ', addedUser);
          const updatedEnroll = await this.enrollmentsModel
            .updateMany(
              { userId: addedUser._id.toString() },
              { studentId: addedUser.studentId },
            )
            .exec();
          console.log('updatedEnroll: ', updatedEnroll);
        } else {
          throw new HttpException('Conflict Student ID', HttpStatus.CONFLICT);
        }
      }
    } else {
      throw new HttpException('Teacher is not a Creator', 403);
    }
  }
}
