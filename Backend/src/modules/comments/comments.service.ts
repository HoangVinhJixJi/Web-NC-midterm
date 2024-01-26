import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { PostCommentDto } from './dto/post-comment.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { NotificationsService } from '../notifications/notifications.service';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { AssignmentsService } from '../assignments/assignments.service';
import { GradeReviewsService } from '../gradeReviews/gradeReviews.service';
import { EventsGateway } from 'src/gateway/events.gateway';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment')
    private commentsModel: Model<Comment>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
    private readonly enrollmentsService: EnrollmentsService,
    @Inject(forwardRef(() => AssignmentsService))
    private readonly assignmentsService: AssignmentsService,
    private readonly eventsGateway: EventsGateway,
    @Inject(forwardRef(() => GradeReviewsService))
    private readonly gradeReviewsService: GradeReviewsService,
  ) {}
  async add(gradeReviewId: string, sendId: string, userData: PostCommentDto) {
    const newComment = {
      gradeReviewId: gradeReviewId,
      sendId: sendId,
      sendName: userData.sendName,
      message: userData.message,
      postAt: new Date().toString(),
    };
    const createComment = new this.commentsModel(newComment);
    const res = await createComment.save();
    const isTeaching = userData.isTeaching;
    console.log('Teaching', isTeaching);

    const gradeReview =
      await this.gradeReviewsService.findOneById(gradeReviewId);

    const allTeachers = await this.enrollmentsService.getTeacherId(
      gradeReview.classId,
    );
    const assignment = await this.assignmentsService.findOneById(
      gradeReview.assignmentId.toString(),
    );
    if (isTeaching) {
      const _message1 = `classId: ${gradeReview.classId},assignmentId: ${gradeReview.assignmentId},gradeReviewId: ${gradeReviewId},message: ${userData.sendName} has posted a comment on your grade review request for the assignment ${assignment.assignmentName}`;
      const enroll = await this.enrollmentsService.getOneByStudentId(
        gradeReview.classId.toString(),
        gradeReview.studentId,
      );
      const notiData1 = {
        receiveId: enroll['userId'],
        message: _message1,
        type: 'teacher_comment_gradeReview',
        status: 'unread',
      };
      const newNoti1 = await this.notificationsService.createNotification(
        sendId,
        notiData1,
      );
      if (newNoti1) {
        //Gửi thông báo socket
        this.eventsGateway.handleEmitSocket({
          data: {
            newNoti1,
          },
          event: 'teacher_comment_gradeReview',
          to: enroll['userId'], //receiveId
        });
      }
    }
    for (const teacher of allTeachers) {
      const teacher_userId = teacher.toString();
      if (teacher_userId !== sendId) {
        let _message = '';
        let _type = '';
        if (isTeaching) {
          _message = `classId: ${gradeReview.classId},assignmentId: ${gradeReview.assignmentId},gradeReviewId: ${gradeReviewId},message: ${userData.sendName} has posted a comment on the grade review request of ${gradeReview.studentId} for the assignment ${assignment.assignmentName}`;
          _type = 'fellow_teacher_comment_gradeReview';
        } else {
          _message = `classId: ${gradeReview.classId},assignmentId: ${gradeReview.assignmentId},gradeReviewId: ${gradeReviewId},message: ${gradeReview.studentId} has posted a comment on the grade review request for the assignment ${assignment.assignmentName}`;
          _type = 'student_comment_gradeReview';
        }
        const notiData = {
          receiveId: teacher_userId,
          message: _message,
          type: _type,
          status: 'unread',
        };
        const newNoti = await this.notificationsService.createNotification(
          sendId,
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
  async delete(commentId: string): Promise<Comment | null> {
    try {
      return await this.commentsModel
        .findOneAndDelete({ _id: commentId })
        .exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAllByGradeReviewId(gradeReviewId: string): Promise<Comment[]> {
    return await this.commentsModel.find({ gradeReviewId }).exec();
  }
  async findAllBySendId(sendId: string): Promise<Comment[]> {
    return await this.commentsModel.find({ sendId }).exec();
  }
  async adminClearCommentByUserId(userId: string) {
    const deleteRes = await this.commentsModel
      .deleteMany({ sendId: userId })
      .exec();
    return deleteRes.acknowledged;
  }
  async deleteByGradeReviewId(gradeReviewId: string): Promise<void> {
    await this.commentsModel.deleteMany({ gradeReviewId }).exec();
  }
}
