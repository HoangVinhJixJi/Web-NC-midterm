import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GradeReview } from './schema/gradeReview.schema';
import { AddGradeReviewDto } from './dto/add-gradeReview.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { AssignmentsService } from '../assignments/assignments.service';
import { EventsGateway } from 'src/gateway/events.gateway';
import { CommentsService } from '../comments/comments.service';

@Injectable()
export class GradeReviewsService {
  constructor(
    @InjectModel('GradeReview')
    private gradeReviewsModel: Model<GradeReview>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly enrollmentsService: EnrollmentsService,
    @Inject(forwardRef(() => AssignmentsService))
    private readonly assignmentsService: AssignmentsService,
    private readonly eventsGateway: EventsGateway,
    private readonly commentsService: CommentsService,
  ) {}
  async add(
    userId: string,
    classId: string,
    assignmentId: string,
    userData: AddGradeReviewDto,
  ) {
    const newGradeReview = {
      classId: classId,
      assignmentId: assignmentId,
      studentId: userData.studentId,
      finalGrade: userData.finalGrade,
      expectedGrade: userData.expectedGrade,
      message: userData.message,
    };
    const createGradeReview = new this.gradeReviewsModel(newGradeReview);
    const res = await createGradeReview.save();

    const allTeachers = await this.enrollmentsService.getTeacherId(classId);
    const assignment = await this.assignmentsService.findOneById(assignmentId);
    for (const teacher of allTeachers) {
      const teacher_userId = teacher.toString();
      const notiData = {
        receiveId: teacher_userId,
        message: `classId: ${classId},assignmentId: ${assignmentId},gradeReviewId: ${res._id},message: ${userData.studentId} send a grade review request to the assignment ${assignment.assignmentName}`,
        type: 'request_gradeReview',
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
          event: 'request_gradeReview',
          to: teacher_userId, //receiveId
        });
      }
    }
    return res;
  }
  async delete(gradeReviewId: string): Promise<GradeReview | null> {
    try {
      const res = await this.gradeReviewsModel
        .findOneAndDelete({ _id: gradeReviewId })
        .exec();
      await this.commentsService.deleteByGradeReviewId(gradeReviewId);
      return res;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findOneAndUpdate(
    userId: string,
    gradeReviewId: string,
    updatedData: any,
  ): Promise<GradeReview | null> {
    const res = await this.gradeReviewsModel
      .findOneAndUpdate({ _id: gradeReviewId }, updatedData, { new: true })
      .exec();

    const gradeReview = res;

    const allTeachers = await this.enrollmentsService.getTeacherId(
      gradeReview.classId,
    );
    const assignment = await this.assignmentsService.findOneById(
      gradeReview.assignmentId.toString(),
    );
    const _message1 = `classId: ${gradeReview.classId},assignmentId: ${gradeReview.assignmentId},gradeReviewId: ${gradeReviewId},message: ${updatedData.sendName} has graded you ${gradeReview.finalGrade} as the final decision on your grade review request for the assignment ${assignment.assignmentName}`;
    const enroll = await this.enrollmentsService.getOneByStudentId(
      gradeReview.classId.toString(),
      gradeReview.studentId,
    );
    const notiData1 = {
      receiveId: enroll['userId'],
      message: _message1,
      type: 'mark_final_decision_gradeReview',
      status: 'unread',
    };
    const newNoti1 = await this.notificationsService.createNotification(
      userId,
      notiData1,
    );
    if (newNoti1) {
      //Gửi thông báo socket
      this.eventsGateway.handleEmitSocket({
        data: {
          newNoti1,
        },
        event: 'mark_final_decision_gradeReview',
        to: enroll['userId'], //receiveId
      });
    }
    for (const teacher of allTeachers) {
      const teacher_userId = teacher.toString();
      if (teacher_userId !== userId) {
        const _message = `classId: ${gradeReview.classId},assignmentId: ${gradeReview.assignmentId},gradeReviewId: ${gradeReviewId},message: ${updatedData.sendName} has graded ${gradeReview.finalGrade} as the final decision on the grade review request of ${gradeReview.studentId} for the assignment ${assignment.assignmentName}`;
        const _type = 'fellow_mark_final_decision_gradeReview';
        const notiData = {
          receiveId: teacher_userId,
          message: _message,
          type: _type,
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
            event: _type,
            to: teacher_userId, //receiveId
          });
        }
      }
    }

    return res;
  }
  async findAllByClassId(classId: string): Promise<GradeReview[]> {
    return await this.gradeReviewsModel.find({ classId }).exec();
  }
  async findAllByStudentId(studentId: string): Promise<GradeReview[]> {
    return await this.gradeReviewsModel.find({ studentId }).exec();
  }
  async findAllByAssignmentId(assignmentId: string): Promise<GradeReview[]> {
    return await this.gradeReviewsModel.find({ assignmentId }).exec();
  }
  async findOneById(gradeReviewId: string): Promise<GradeReview> {
    return await this.gradeReviewsModel.findOne({ _id: gradeReviewId }).exec();
  }
  async findAllByEachStudent(
    classId: string,
    assignmentId: string,
    studentId: string,
  ): Promise<GradeReview[]> {
    return await this.gradeReviewsModel
      .find({
        classId,
        assignmentId,
        studentId,
      })
      .exec();
  }
  async adminClearGradeReviewByClass(classId: any) {
    return this.gradeReviewsModel.deleteMany({ classId: classId }).exec();
  }
  async deleteByAssignmentId(assignmentId: string): Promise<void> {
    try {
      const gradeReviews = await this.findAllByAssignmentId(assignmentId);
      for (const gradeReview of gradeReviews) {
        await this.delete(gradeReview._id);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
