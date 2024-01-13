import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Class } from './schema/class.schema';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { PendingInvitesService } from '../pendingInvites/pendingInvites.service';
import { PendingInvite } from '../pendingInvites/schema/pendingInvite.schema';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { UsersService } from '../users/users.service';
import { SortOrderEnum } from '../../enums/sort-order.enum';
import { ClassStatusEnum } from '../../enums/class-status.enum';
import { AssignStudentIdDto } from '../admin/management/class/dto/assign-student-id.dto';
import { GradesService } from '../grades/grades.service';
import { AssignmentsService } from '../assignments/assignments.service';
import { GradeStructuresService } from '../gradeStructures/gradeStructures.service';
import { GradeReviewsService } from '../gradeReviews/gradeReviews.service';

@Injectable()
export class ClassesService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
    private pendingInvitesService: PendingInvitesService,
    private enrollmentsService: EnrollmentsService,
    private usersService: UsersService,
    private gradesService: GradesService,
    private assignmentsService: AssignmentsService,
    private gradeStructuresService: GradeStructuresService,
    private gradeReviewsService: GradeReviewsService,
    @InjectModel('Class') private classesModel: Model<Class>,
  ) {}
  async create(userData: CreateClassDto, userId: any): Promise<Class> {
    const newClassData = {
      className: userData.className,
      classCode: uuidv4(),
      description: userData.description,
      status: ClassStatusEnum.Active,
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
      return enrollments
        .map((enrollment) => enrollment['classId'])
        .filter((enrollment) => enrollment !== null);
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
  async getAll(): Promise<Class[]> {
    return await this.classesModel.find().exec();
  }
  async findClassesByIds(classIds: any): Promise<Class[]> {
    try {
      // Sử dụng phương thức find và truyền mảng classIds vào
      const classes = await this.classesModel
        .find({ _id: { $in: classIds } })
        .exec();
      return classes;
    } catch (error) {
      throw error;
    }
  }
  async findClassById(classId: any): Promise<Class> {
    try {
      const classes = await this.classesModel.findById({ _id: classId }).exec();
      return classes;
    } catch (error) {
      throw error;
    }
  }
  async findClassByClassCode(classCode: any): Promise<Class> {
    try {
      const classes = await this.classesModel.findOne({ classCode }).exec();
      return classes;
    } catch (error) {
      throw error;
    }
  }
  async addEnrollment(clasId: string, userId: string) {
    try {
      const newEnrollment = await this.enrollmentsService.add(
        clasId,
        userId,
        'student',
        false,
      );
      return newEnrollment;
    } catch (error) {
      throw error;
    }
  }
  async findByClassId(classId: string): Promise<Class | null> {
    try {
      return await this.classesModel.findOne({ _id: classId }).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async inviteEmail(
    classId: string,
    email: string,
    role: string,
    userEmail: string,
  ) {
    const pendingInvite =
      await this.pendingInvitesService.findByClassIdAndEmailAndRole(
        classId,
        email,
        role,
      );
    if (pendingInvite) {
      return await this.createInvitationData(pendingInvite, userEmail);
    } else {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
  }
  async createInvitationData(pendingInvite: PendingInvite, userEmail: string) {
    const payload = {
      classId: pendingInvite.classId.toString(),
      email: pendingInvite.email,
      role: pendingInvite.role,
    };
    const invite_token = await this.jwtService.signAsync(payload);
    await this.pendingInvitesService.findOneAndUpdate(
      payload.classId,
      payload.email,
      payload.role,
      {
        inviteToken: invite_token,
      },
    );
    const c = await this.findByClassId(pendingInvite.classId.toString());
    return {
      receiver: pendingInvite.email,
      sender: userEmail,
      className: c.className,
      role: pendingInvite.role,
      invite_token,
    };
  }
  async sendInvitationEmail(pendingInviteInfo: {
    receiver: string;
    sender: string;
    className: string;
    role: string;
    invite_token: string;
  }) {
    const invitationLink = `${this.configService.get<string>(
      'public_url',
    )}/classes/join-invite-email/${pendingInviteInfo.invite_token}`;
    const mailData = {
      subject: 'Tham gia lớp học',
      to: pendingInviteInfo.receiver,
      template: 'invitation',
      context: {
        receiver: pendingInviteInfo.receiver,
        sender: pendingInviteInfo.sender,
        className: pendingInviteInfo.className,
        role: pendingInviteInfo.role,
        invitationLink: invitationLink,
      },
    };
    await this.mailService.sendEmail(mailData);
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
      return {
        classInfo: _class,
        joined: true,
      };
    }
    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
  async archive(userId: any, classId: string) {
    const member = await this.enrollmentsService.getOne(classId, userId);
    if (member !== null) {
      return member.role === 'teacher'
        ? await this.classesModel.findOneAndUpdate(
            { _id: classId },
            { status: ClassStatusEnum.Archived },
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
            { status: ClassStatusEnum.Active },
            { new: true },
          )
        : new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }
  async delete(userId: any, classId: string) {
    const isArchived = await this.isArchived(classId);
    if (isArchived) {
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
    return status !== null && status === ClassStatusEnum.Archived;
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
  async getUserClassesForAdmin(
    userId: any,
    role: string,
    status: string = '',
    searchTerm: any = '',
  ) {
    try {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(searchTerm);
      const enrollments =
        await this.enrollmentsService.getEnrollmentsPopulatedUser(
          userId,
          'classId',
          role,
          status,
          isValidObjectId ? searchTerm : '',
        );
      return Promise.all(
        enrollments.map(async (enrollment) => {
          const user = { timeOfParticipation: enrollment.joinAt };
          const classObject: any = enrollment.classId;
          const classId = classObject._id.toString();
          let creatorInfo: any;
          if (enrollment.isCreator) {
            creatorInfo = await this.usersService.findOneById(
              enrollment.userId,
            );
          } else {
            console.log(classId);
            const creator = await this.enrollmentsService.findEnrollments({
              classId: classId,
              isCreator: true,
            });
            creatorInfo = await this.usersService.findOneById(
              creator[0].userId,
            );
          }
          return {
            classInfo: {
              classId,
              status: classObject.status,
              creator: {
                username: creatorInfo.username,
                fullName: creatorInfo.fullName,
                avatar: creatorInfo.avatar,
              },
            },
            user,
          };
        }),
      );
    } catch (error) {
      throw new Error(error);
    }
  }
  async getClassListByPage(
    param: { take: number; skip: number },
    filter: any = {},
    sort: { sortedBy: string; sortOrder: string },
  ) {
    const total = await this.classesModel.countDocuments(filter);
    if (total === 0 || param.skip >= total) {
      return { totalPages: total, classes: [] };
    }
    const totalPages = Math.ceil(total / param.take);
    let sortCondition: any = {};
    switch (sort.sortedBy.toLowerCase()) {
      case 'classid':
        sortCondition = {
          ...sortCondition,
          _id: sort.sortOrder.toLowerCase() === SortOrderEnum.Increase ? 1 : -1,
        };
        break;
      case 'classname':
        sortCondition = {
          ...sortCondition,
          className:
            sort.sortOrder.toLowerCase() === SortOrderEnum.Increase ? 1 : -1,
        };
        break;
      case 'creator.fullname':
        break;
      default:
        sortCondition = { ...sortCondition, _id: 1 };
    }
    if (Object.keys(sortCondition).length !== 0) {
      const classes = await this.classesModel
        .find(filter)
        .sort(sortCondition)
        .skip(param.skip)
        .limit(param.take)
        .exec();
      const classesWithCreator = await Promise.all(
        classes.map(async (_class) => {
          return {
            classId: _class._id,
            className: _class.className,
            creator: await this.findClassCreator(_class._id),
            status: _class.status,
          };
        }),
      );
      return { totalPages, classes: classesWithCreator };
    } else {
      const classes = await this.classesModel.find(filter).exec();
      const classesWithCreator = await Promise.all(
        classes.map(async (_class) => {
          return {
            classId: _class._id,
            className: _class.className,
            creator: await this.findClassCreator(_class._id),
            status: _class.status,
          };
        }),
      );
      const sortedClasses = classesWithCreator.sort((a, b) => {
        const lastNameA = a.creator.fullName.split(' ').pop().toLowerCase();
        const lastNameB = b.creator.fullName.split(' ').pop().toLowerCase();
        return sort.sortOrder.toLowerCase() === SortOrderEnum.Increase
          ? lastNameA.localeCompare(lastNameB)
          : lastNameB.localeCompare(lastNameA);
      });
      const finalClasses = sortedClasses.slice(
        param.skip,
        param.skip + param.take,
      );
      return { totalPages, classes: finalClasses };
    }
  }
  private async findClassCreator(classId: any) {
    const enrollment = await this.enrollmentsService.findEnrollments({
      classId: classId,
      isCreator: true,
    });
    const creator = await this.usersService.findOneById(enrollment[0].userId);
    return {
      username: creator.username,
      fullName: creator.fullName,
      avatar: creator.avatar,
    };
  }
  async adminArchive(classId: string) {
    return this.classesModel.findOneAndUpdate(
      { _id: classId },
      { status: ClassStatusEnum.Archived },
      { new: true },
    );
  }
  async adminRestore(classId: string) {
    return this.classesModel.findOneAndUpdate(
      { _id: classId },
      { status: ClassStatusEnum.Active },
      { new: true },
    );
  }
  async adminDelete(classId: string) {
    const isArchived = await this.isArchived(classId);
    if (isArchived) {
      //const result = await this.enrollmentsService.deleteMembers(classId);
      const result = await this.adminClearDataInvolveClass(classId);
      if (result) {
        return this.classesModel.findByIdAndDelete(classId);
      }
    }
    return Promise.resolve(undefined);
  }
  async adminClearClass(classId: any) {
    const result = await this.adminClearDataInvolveClass(classId);
    if (result) {
      return this.classesModel.findByIdAndDelete(classId);
    }
  }
  async adminGetClassInfo(classId: string) {
    return this.classesModel.findOne({ _id: classId }).exec();
  }
  async adminGetClassTeachers(classId: string) {
    const teachers = await this.enrollmentsService.getEnrollmentsPopulatedClass(
      classId,
      'userId',
      null,
      'teacher',
      '_id username fullName avatar',
    );
    return teachers
      .filter((teacher) => teacher.userId !== null)
      .map((teacher) => {
        const userIdObj: any = teacher.userId;
        return {
          userId: userIdObj._id,
          username: userIdObj.username,
          fullName: userIdObj.fullName,
          avatar: userIdObj.avatar,
          timeOfParticipation: teacher.joinAt,
          isCreator: teacher.isCreator,
        };
      });
  }
  async adminGetClassStudents(classId: string) {
    const students = await this.enrollmentsService.getEnrollmentsPopulatedClass(
      classId,
      'userId',
      null,
      'student',
      '_id username fullName avatar studentId',
    );
    return students
      .filter((student) => student.userId !== null)
      .map((student) => {
        const userIdObj: any = student.userId;
        return {
          userId: userIdObj._id,
          username: userIdObj.username,
          fullName: userIdObj.fullName,
          avatar: userIdObj.avatar,
          timeOfParticipation: student.joinAt,
          studentId: userIdObj.studentId,
        };
      });
  }
  async adminAssignStudentId(
    userId: string,
    classId: string,
    studentId: string,
  ) {
    const filter = { userId: userId, classId: classId };
    const updateData = { studentId: studentId };
    return this.enrollmentsService.adminUpdate(filter, updateData);
  }
  async adminAssignStudentIdViaList(importedData: Array<AssignStudentIdDto>) {
    return Promise.all(
      importedData.map(async (data) => {
        return await this.adminAssignStudentId(
          data.userId,
          data.classId,
          data.studentId,
        );
      }),
    );
  }
  async adminGetAllClasses() {
    return this.classesModel.find({ _id: { $ne: null } }).exec();
  }
  async adminSetCreator(userId: string, classId: string) {
    return this.enrollmentsService.adminSetCreator(userId, classId);
  }
  async adminClearDataInvolveClass(classId: any) {
    const clearGradeResult =
      await this.gradesService.adminClearGradeByClass(classId);
    const clearGradeStructureResult =
      await this.gradeStructuresService.adminClearGradeStructureByClass(
        classId,
      );
    const clearGradeReviewResult =
      await this.gradeReviewsService.adminClearGradeReviewByClass(classId);
    const clearAssignment =
      await this.assignmentsService.adminClearAssignmentByClass(classId);
    const clearEnrollment =
      await this.enrollmentsService.deleteMembers(classId);
    return (
      clearGradeResult.acknowledged &&
      clearGradeStructureResult.acknowledged &&
      clearGradeReviewResult.acknowledged &&
      clearAssignment.acknowledged &&
      clearEnrollment.acknowledged
    );
  }
  async adminTakeUserLeaveClass(classId: any, userId: string) {
    return this.enrollmentsService.deleteOne(classId, userId);
  }
}
