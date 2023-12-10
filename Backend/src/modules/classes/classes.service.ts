import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { Class } from './schema/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { Model } from 'mongoose';
import { UpdateClassDto } from './dto/update-class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectModel('Class') private classesModel: Model<Class>,
    private enrollmentsService: EnrollmentsService,
  ) {}
  async create(userData: CreateClassDto, userId: any): Promise<Class> {
    const newClassData = {
      className: userData.className,
      classCode: uuidv4(),
      description: userData.description,
      status: 'active',
      createAt: new Date().toString(),
    };
    const createClass = new this.classesModel(newClassData);
    const newClass = await createClass.save();
    const classId = newClass._id.toString();
    await this.enrollmentsService.add(classId, userId, 'teacher', true);
    return newClass;
  }
  async getClasses(userId: any, role: any, status: any) {
    try {
      const enrollments =
        await this.enrollmentsService.getEnrollmentsPopulatedUser(
          userId,
          'classId',
          role,
          status,
        );
      return enrollments.map((enrollment) => enrollment['classId']);
    } catch (error) {
      throw new Error(error);
    }
  }
  async getClassInfo(userId: any, classId: string) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    if (member !== null) {
      const _class = await this.classesModel.findOne({ _id: classId }).exec();
      return member.role === 'teacher'
        ? _class
        : { className: _class.className, description: _class.description };
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async update(userId: any, classId: any, userData: UpdateClassDto) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    return member !== null
      ? member.role === 'teacher'
        ? await this.classesModel.findOneAndUpdate(
            { _id: classId },
            {
              className: userData.className,
              description: userData.description,
            },
            { new: true },
          )
        : new HttpException('Forbidden', HttpStatus.FORBIDDEN)
      : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async joinClass(userId: any, classCode: string) {
    const _class = await this.classesModel
      .findOne({ classCode: classCode })
      .exec();
    if (_class) {
      const member = await this.enrollmentsService.getOne(
        _class._id.toString(),
        userId,
      );
      if (!member) {
        const newMember = await this.enrollmentsService.add(
          _class._id.toString(),
          userId,
          'student',
          false,
        );
        return {
          classInfo: _class,
          joined: !!newMember,
        };
      }
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
  async archive(userId: any, classId: string) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    if (member !== null) {
      return member.role === 'teacher'
        ? await this.classesModel.findOneAndUpdate(
            { _id: classId },
            { status: 'archive' },
            { new: true },
          )
        : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async restore(userId: any, classId: string) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    if (member !== null) {
      return member.role === 'teacher'
        ? await this.classesModel.findOneAndUpdate(
            { _id: classId },
            { status: 'active' },
            { new: true },
          )
        : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async delete(userId: any, classId: string) {
    const isArchived = await this.isArchived(classId);
    if (!isArchived) {
      const member = await this.enrollmentsService.getOne(classId, userId);
      if (member !== null) {
        if (member.isCreator) {
          const result = await this.enrollmentsService.deleteMembers(classId);
          if (result.acknowledged) {
            return this.classesModel.findByIdAndDelete(classId);
          }
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }
  async removeMember(userId: any, classId: string, rmvId: string) {
    const isArchived = await this.isArchived(classId);
    if (!isArchived) {
      if (userId === rmvId) {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      }
      const member = await this.enrollmentsService.getOne(classId, userId);
      if (member !== null) {
        if (member.isCreator) {
          return this.enrollmentsService.deleteOne(classId, rmvId);
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }
  async leaveClass(classId: string, userId: any) {
    const isArchived = await this.isArchived(classId);
    if (!isArchived) {
      const member = await this.enrollmentsService.getOne(classId, userId);
      if (member !== null) {
        if (!member.isCreator) {
          return this.enrollmentsService.deleteOne(classId, userId);
        }
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
  }
  private async isArchived(classId: string) {
    const { status } = await this.classesModel.findOne({ _id: classId }).exec();
    return status !== null && status === 'archive';
  }
  async getClassInfoAndUserJoinedStatus(userId: any, classCode: string) {
    const _class = await this.classesModel.findOne({ classCode: classCode });
    if (_class) {
      const member = await this.enrollmentsService.getOne(
        _class._id.toString(),
        userId,
      );
      return {
        classInfo: _class,
        joined: !!member,
      };
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
