import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Enrollment } from './schema/enrollment.schema';
import { User } from '../users/schema/user.schema';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectModel('Enrollment') private enrollmentsModel: Model<Enrollment>,
    @InjectModel('User') private usersModel: Model<User>,
  ) {}
  async add(classId: string, userId: string, role: string, isCreator: boolean) {
    const user = await this.usersModel.findOne({ _id: userId }).exec();
    const newEnrollment = {
      classId,
      userId,
      role,
      joinAt: new Date().toString(),
      isCreator,
      studentId: user.studentId,
    };
    const createEnrollment = new this.enrollmentsModel(newEnrollment);
    return createEnrollment.save();
  }
  async findAllByClassId(classId: string): Promise<Enrollment[]> {
    try {
      const enrollments = await this.enrollmentsModel.find({ classId }).exec();
      return enrollments;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEmailsByClassId(classId: string): Promise<string[]> {
    try {
      const enrollments = await this.enrollmentsModel.find({ classId }).exec();

      // Lấy userIds từ enrollments
      const userIds = enrollments.map((enrollment) => enrollment.userId);

      // Lấy emails từ bảng Users
      const users = await this.usersModel
        .find({ _id: { $in: userIds } })
        .exec();
      const emails = users.map((user) => user.email);

      return emails;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getUserIdOfStudentByClassId(classId: string): Promise<string[]> {
    try {
      const enrollments = await this.enrollmentsModel
        .find({ classId, role: 'student' })
        .exec();
      // Lấy userIds từ enrollments
      const userIds = enrollments.map((enrollment) =>
        enrollment.userId.toString(),
      );
      return userIds;
    } catch (error) {
      throw new Error(error);
    }
  }
  async getStudentIdByClassId(classId: string): Promise<string[]> {
    try {
      const enrollments = await this.enrollmentsModel
        .find({ classId, role: 'student' })
        .exec();
      // Lấy userIds từ enrollments
      const userIds = enrollments.map((enrollment) => enrollment.studentId);
      return userIds;
    } catch (error) {
      throw new Error(error);
    }
  }
  async hasEmailJoinedClass(email: string, classId: string): Promise<boolean> {
    try {
      const enrolledEmails = await this.getEmailsByClassId(classId);
      return enrolledEmails.includes(email);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEnrollmentsPopulatedUser(
    userId: string,
    populate: string,
    role: string,
    status: string,
    classId: string = '',
  ) {
    const extraFilter = classId !== '' ? { classId } : {};
    try {
      return role !== null
        ? await this.enrollmentsModel
            .find({ userId, role, ...extraFilter })
            .populate({
              path: populate,
              match: status !== '' ? { status: status } : {},
            })
        : await this.enrollmentsModel.find({ userId }).populate({
            path: populate,
            match: status !== '' ? { status: status } : {},
          });
    } catch (error) {
      throw new Error(error);
    }
  }
  async getEnrollmentsPopulatedClass(
    classId: string,
    populate: string,
    notEqual: any,
    role: string,
    select: string,
  ) {
    try {
      return role !== null
        ? select !== ''
          ? await this.enrollmentsModel
              .find({ classId, role, userId: { $ne: notEqual } })
              .populate({ path: populate, select: select })
          : await this.enrollmentsModel
              .find({ classId, role, userId: { $ne: notEqual } })
              .populate(populate)
        : select !== ''
          ? await this.enrollmentsModel
              .find({ classId, userId: { $ne: notEqual } })
              .populate({ path: populate, select: select })
          : await this.enrollmentsModel
              .find({ classId, userId: { $ne: notEqual } })
              .populate(populate);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getOne(classId: string, userId: any) {
    return this.enrollmentsModel.findOne({ classId, userId }).exec();
  }
  async getOneByStudentId(classId: string, studentId: any) {
    return this.enrollmentsModel.findOne({ classId, studentId }).exec();
  }
  async getMembers(userId: string, classId: any, _role: string) {
    const member = await this.enrollmentsModel
      .findOne({ userId, classId })
      .exec();
    if (member) {
      try {
        const select =
          member.role === 'teacher'
            ? '_id fullName email avatar'
            : 'fullName avatar email -_id';
        const notEqual = member.role === 'student' ? member.userId : null;
        const enrollments = await this.getEnrollmentsPopulatedClass(
          classId,
          'userId',
          notEqual,
          _role,
          select,
        );
        return enrollments.map((enrollment) => {
          return {
            memberInfo: enrollment['userId'],
            role: enrollment.role,
            studentId: enrollment.studentId,
          };
        });
      } catch (error) {
        throw new Error(error);
      }
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
  async deleteMembers(classId: string) {
    return this.enrollmentsModel.deleteMany({ classId: classId });
  }
  async deleteOne(classId: string, rmvId: string) {
    return this.enrollmentsModel.findOneAndDelete({
      classId: classId,
      userId: rmvId,
    });
  }
  async updateStudentId(classId: string, userId: any, newStudentId: string) {
    // Tìm kiếm enrollment dựa trên classId và userId
    const existingEnrollment = await this.enrollmentsModel
      .findOne({ classId, userId })
      .exec();
    // Nếu tồn tại enrollment, thì cập nhật giá trị studentId
    if (existingEnrollment) {
      existingEnrollment.studentId = newStudentId['studentId'];
      await existingEnrollment.save();
      return existingEnrollment;
    }

    // Nếu không tồn tại, tạo một enrollment mới với giá trị studentId
    const newEnrollment = new this.enrollmentsModel({
      classId,
      userId,
      studentId: newStudentId,
    });
    return newEnrollment.save();
  }
  async updateListStudentId(data: any) {
    // Tìm kiếm enrollment dựa trên classId và userId
    const classId = data.classId;
    const updated = [];
    for (const row of data.list) {
      // Tìm kiếm enrollment dựa trên classId và userId
      const existingEnrollment = await this.enrollmentsModel
        .findOne({ classId, userId: row.userId })
        .exec();
      // Nếu tồn tại enrollment, thì cập nhật giá trị studentId
      if (
        existingEnrollment &&
        existingEnrollment.studentId !== row.studentId
      ) {
        //Cập nhật trong enrollment
        existingEnrollment.studentId = row['studentId'];
        await existingEnrollment.save();
        console.log('existingEnrollment: ', existingEnrollment);
        updated.push(existingEnrollment);
      }
    }
    return updated;
  }
  //Kiểm tra xem có studentId hay chưa khi tham gia lớp học
  async checkStudentId(userId: string, classId: string): Promise<boolean> {
    // Kiểm tra xem đã có enrollment cho userId và classId chưa
    const existingEnrollment = await this.enrollmentsModel.findOne({
      userId,
      classId,
    });
    if (existingEnrollment) {
      if (
        existingEnrollment.role === 'student' &&
        existingEnrollment.studentId !== null
      ) {
        return true;
      }
      if (existingEnrollment.role === 'teacher') {
        return true;
      }
      return false;
    } else {
      return false;
    }
  }
  async getStudentId(userId: string, classId: string): Promise<string> {
    const enrollment = await this.enrollmentsModel.findOne({
      userId,
      classId,
    });
    return enrollment.studentId;
  }
  async findEnrollments(filter: any = {}) {
    return this.enrollmentsModel.find(filter).exec();
  }
  async adminUpdate(
    filter: { classId: string; userId: string },
    updateData: { studentId: string },
  ) {
    return this.enrollmentsModel.findOneAndUpdate(filter, updateData, {
      new: true,
    });
  }
  async adminSetCreator(userId: string, classId: string) {
    return this.enrollmentsModel.findOneAndUpdate(
      { userId: userId, classId: classId },
      { isCreator: true },
      { new: true },
    );
  }
  async getTeacherId(classId: any) {
    const enrollments = await this.enrollmentsModel
      .find({ classId, role: 'teacher' })
      .exec();
    const userIds = enrollments.map((enrollment) => enrollment.userId);
    return userIds;
  }
  async mapStudentIdFromUser(userId: string, studentId: any) {
    return this.enrollmentsModel
      .updateMany({ userId: userId }, { studentId: studentId }, { new: true })
      .exec();
  }
}
