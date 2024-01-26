import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Grade } from './schema/grade.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateGradeDto } from './dto/create-grade.dto';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { NotificationsService } from '../notifications/notifications.service';
import { AssignmentsService } from '../assignments/assignments.service';
import { EventsGateway } from 'src/gateway/events.gateway';
@Injectable()
export class GradesService {
  constructor(
    @InjectModel('Grade')
    private gradesModel: Model<Grade>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly enrollmentsService: EnrollmentsService,
    private readonly notificationsService: NotificationsService,
    private readonly assignmentsService: AssignmentsService,
    private readonly eventsGateway: EventsGateway,
  ) {}
  async create(gradeData: CreateGradeDto): Promise<Grade> {
    try {
      //console.log('gradeData before update: ', gradeData);
      const newGradeData = {
        classId: gradeData.classId,
        assignmentId: gradeData.assignmentId,
        studentId: gradeData.studentId,
        score: gradeData.score,
        status: gradeData.status,
      };
      const existingGrade = await this.gradesModel
        .findOne({
          classId: gradeData.classId,
          assignmentId: gradeData.assignmentId,
          studentId: gradeData.studentId,
        })
        .exec();
      //console.log('existingGrade: ', existingGrade);
      // Nếu tồn tại grade
      if (existingGrade) {
        existingGrade.score = gradeData['score'];
        existingGrade.status = gradeData['status'];
        await existingGrade.save();
        return existingGrade;
      }
      // Nếu không tồn tại, tạo một grade mới score
      const createGrade = new this.gradesModel(newGradeData);
      const newGrade = await createGrade.save();
      return newGrade;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteGrade(
    classId: string,
    assignmentId: string,
    studentId: string,
  ): Promise<any> {
    return await this.gradesModel
      .deleteOne({ classId, assignmentId, studentId })
      .exec();
  }
  async deleteGradeAssignment(
    classId: string,
    assignmentId: string,
  ): Promise<any> {
    return await this.gradesModel.deleteMany({ classId, assignmentId }).exec();
  }
  async updateOneGrade(colName: string, data: any): Promise<any> {
    const classId = data.classId;
    const assignmentId = data.assignmentId;
    const studentId = data.studentId;
    const rs = await this.gradesModel
      .findOneAndUpdate(
        { classId, assignmentId, studentId },
        {
          [colName]: data[colName],
        },
        { new: true },
      )
      .exec();
    return rs;
  }
  //Chỉnh sửa status cho 1 học sinh
  async updateStatusGradeOfStudent(userId: string, data: any): Promise<any> {
    const updated = await this.updateOneGrade('status', data);
    //Gửi thông báo
    const detailAssign = await this.assignmentsService.findOneById(
      data.assignmentId,
    );
    const enroll = await this.enrollmentsService.getOneByStudentId(
      data.classId,
      data.studentId,
    );
    //Lưu vào Notification
    const notiData = {
      receiveId: enroll['userId'],
      message: `classId: ${data.classId},assignmentId: ${data.assignmentId},gradeReviewId: ${null} ,message: Your score for ${detailAssign['assignmentName']} is: ${updated.score} points`,
      type: 'public_grade',
      status: 'unread',
    };
    const newNoti = await this.notificationsService.createNotification(
      userId,
      notiData,
    );
    if (newNoti) {
      //Gửi thông báo socket
      this.eventsGateway.handleEmitSocket({
        data: {
          newNoti,
        },
        event: 'public_grade',
        to: enroll['userId'].toString(), //receiveId
      });
    }
  }
  //Chỉnh sửa status cho 1 học sinh
  async updateStudentIdsGrade(data: any): Promise<any> {
    const classId = data.classId;
    const updated = [];
    for (const row of data.list) {
      if (row && row.oldStudentId && row.studentId) {
        // Kiểm tra xem row, oldStudentId và studentId có giá trị hợp lệ
        // Thực hiện cập nhật
        const result = await this.gradesModel
          .updateMany(
            { classId, studentId: row.oldStudentId },
            { $set: { studentId: row.studentId } },
          )
          .exec();
        updated.push(result);
        console.log(`Updated records for student ${row.oldStudentId}`);
      } else {
        console.log(`Invalid row: ${JSON.stringify(row)}`);
      }
    }
    return updated;
  }

  //Chỉnh sửa status điểm số của 1 bài tập cho tất cả học sinh
  async updateStatusGradeOfAssignment(
    userId: string,
    data: any,
  ): Promise<Grade[]> {
    const updatedGrades = [];
    const classId = data.classId;
    const assignmentId = data.assignmentId;
    const detailAssign =
      await this.assignmentsService.findOneById(assignmentId);
    const studentList = await this.enrollmentsService.getMembers(
      userId,
      classId,
      'student',
    );
    for (const student of studentList) {
      if (student !== null) {
        const enroll = await this.enrollmentsService.getOneByStudentId(
          classId,
          student.studentId,
        );
        const updated = await this.updateOneGrade('status', {
          classId,
          assignmentId,
          studentId: student.studentId,
          status: 'public',
        });
        updatedGrades.push(updated);
        //Lưu vào Notification
        const notiData = {
          receiveId: enroll['userId'],
          message: `classId: ${data.classId},assignmentId: ${data.assignmentId},gradeReviewId: ${null} ,message: Your score for ${detailAssign['assignmentName']} is: ${updated.score} points`,
          type: 'public_grade',
          status: 'unread',
        };
        const newNoti = await this.notificationsService.createNotification(
          userId,
          notiData,
        );
        if (newNoti) {
          //Gửi thông báo socket
          this.eventsGateway.handleEmitSocket({
            data: {
              newNoti,
            },
            event: 'public_grade',
            to: enroll['userId'].toString(), //receiveId
          });
        }
      }
    }
    return updatedGrades;
  }
  //Chỉnh sửa điểm số của 1 bài tập sau khi upload file
  async updateGradeAssignment(gradeData: any): Promise<Grade[]> {
    const updatedGrades = [];
    // Lặp qua từng phần tử trong mảng gradeData
    const classId = gradeData.classId;
    const assignmentId = gradeData.assignmentId;
    gradeData.list.forEach(async (entry: any) => {
      const { studentId, grade } = entry;
      // Tìm grade hiện tại
      const existingGrade = await this.gradesModel
        .findOne({ classId, assignmentId, studentId })
        .exec();
      // Nếu grade đã tồn tại, cập nhật điểm
      if (existingGrade) {
        if (grade === '') {
          console.log('********** delete one');
          await this.deleteGrade(classId, assignmentId, studentId);
        } else {
          existingGrade.score = grade;
          existingGrade.status = 'unlisted'; //Mặc định khi lưu từ file là unlisted
          await existingGrade.save();
          updatedGrades.push(existingGrade);
        }
      } else {
        // Nếu grade chưa tồn tại, tạo mới và lưu vào database
        const newGradeData = {
          classId,
          assignmentId,
          studentId,
          score: grade,
          status: 'unlisted',
        };
        const createGrade = new this.gradesModel(newGradeData);
        const newGrade = await createGrade.save();
        updatedGrades.push(newGrade);
      }
    });
    return updatedGrades;
  }
  async findAllByAssignmentId(
    classId: string,
    assignmentId: string,
  ): Promise<Grade[]> {
    try {
      const grades = await this.gradesModel
        .find({ classId, assignmentId })
        .exec();
      //console.log('grades by assignmentId: ', grades);
      return grades;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAllByClassId(classId: string): Promise<Grade[]> {
    try {
      const grades = await this.gradesModel.find({ classId }).exec();
      //console.log('grades by classId: ', grades);
      return grades;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteGradeById(gradeId: any): Promise<Grade | null> {
    try {
      const deletedGrade = await this.gradesModel
        .findOneAndDelete(gradeId)
        .exec();
      return deletedGrade;
    } catch (error) {
      throw error;
    }
  }
  async findOneAndUpdate(
    gradeId: string,
    updatedData: any,
  ): Promise<Grade | null> {
    return await this.gradesModel
      .findOneAndUpdate({ _id: gradeId }, updatedData, {
        new: true,
      })
      .exec();
  }
  async findOneById(gradeId: string): Promise<Grade | null> {
    try {
      return await this.gradesModel.findById(gradeId).exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async findMyGrade(
    userId: string,
    classId: string,
    assignmentId: string,
  ): Promise<any | null> {
    try {
      const enroll = await this.enrollmentsService.getOne(classId, userId);
      if (enroll) {
        const myGrade = await this.gradesModel
          .findOne({ studentId: enroll.studentId, classId, assignmentId })
          .exec();
        if (myGrade.status === 'public') {
          return myGrade;
        } else {
          myGrade.score = null; //KHông tiết lộ điểm
          return myGrade;
        }
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async adminClearGradeByClass(classId: any) {
    return this.gradesModel.deleteMany({ classId: classId }).exec();
  }
  async deleteByAssignmentId(
    classId: string,
    assignmentId: string,
  ): Promise<void> {
    await this.gradesModel.deleteMany({ classId, assignmentId }).exec();
  }
}
