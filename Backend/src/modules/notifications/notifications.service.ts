import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schema/notification.schema';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
//import { CreateNotiDto } from './dto/create-notification.dto';
import { EnrollmentsService } from '../enrollments/enrollments.service';
import { EventsGateway } from '../../gateway/events.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel('Notification')
    private notificationsModel: Model<Notification>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly eventsGateway: EventsGateway,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  async createNotification(
    userId: string,
    notificationData: any,
  ): Promise<Notification> {
    console.log(
      'notificationData before update Notification: ',
      notificationData,
    );
    const newNotificationData = {
      sendId: userId,
      receiveId: notificationData.receiveId,
      message: notificationData.message,
      type: notificationData.type,
      status: notificationData.status,
      createAt: new Date().toString(),
    };
    const createNotification = new this.notificationsModel(newNotificationData);
    const newNotification = await createNotification.save();
    // console.log('=====  newNotification  ==== ', newNotification);
    // this.eventsGateway.handleEmitSocket({
    //   data: { message: notificationData.message },
    //   event: 'public_grade',
    //   to: notificationData.receiveId,
    // });
    return newNotification;
  }
  async createNotificationForEntireClass(
    classId: string,
    userId: string,
    notiData: any,
  ): Promise<Notification[]> {
    try {
      // Lấy danh sách userId từ enrollments.service
      const userIds =
        await this.enrollmentsService.getUserIdOfStudentByClassId(classId);

      // Tạo thông báo cho mỗi học sinh trong danh sách
      const notifications = await Promise.all(
        userIds.map(async (studentId) => {
          const notificationData = {
            sendId: userId,
            receiveId: studentId,
            message: notiData.message,
            type: notiData.type,
            status: notiData.status,
            createAt: new Date().toString(),
          };
          const createNotification = new this.notificationsModel(
            notificationData,
          );
          return await createNotification.save();
        }),
      );
      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteNotification(notiId: string): Promise<any> {
    return await this.notificationsModel.deleteOne({ _id: notiId }).exec();
  }
  async deleteNotifications(): Promise<any> {
    return await this.notificationsModel.deleteMany({}).exec();
  }
  async findAllByUserId(userId: string, role: string): Promise<Notification[]> {
    try {
      if (role === 'send') {
        const notifications = await this.notificationsModel
          .find({ sendId: userId })
          .exec();
        return notifications;
      } else if (role === 'receive') {
        const notifications = await this.notificationsModel
          .find({ receiveId: userId })
          .exec();
        return notifications;
      }
    } catch (error) {
      throw new Error(error);
    }
  }
  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    try {
      // Tìm tất cả các thông báo có sendId hoặc receiveId là userId
      const notifications = await this.notificationsModel
        .find({
          $or: [{ sendId: userId }, { receiveId: userId }],
        })
        .exec();
      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAllByColName(
    colName: string,
    value: string,
  ): Promise<Notification[]> {
    try {
      const notifications = await this.notificationsModel
        .find({ colName: value })
        .exec();
      return notifications;
    } catch (error) {
      throw new Error(error);
    }
  }
  async deleteNotificationById(notiId: any): Promise<Notification | null> {
    try {
      const deletedNotification = await this.notificationsModel
        .findOneAndDelete(notiId)
        .exec();
      return deletedNotification;
    } catch (error) {
      throw error;
    }
  }
  async findOneAndUpdate(
    sendId: string,
    receiveId: string,
    type: string,
    updateData: any,
  ): Promise<Notification | null> {
    return await this.notificationsModel
      .findOneAndUpdate({ sendId, receiveId, type }, updateData, {
        new: true,
      })
      .exec();
  }
  async findOneById(notificationId: string): Promise<Notification | null> {
    try {
      return await this.notificationsModel.findById(notificationId).exec();
    } catch (error) {
      throw new Error(error);
    }
  }

  //Update status noti
  async updateOneColNotification(colName: string, data: any): Promise<any> {
    const rs = await this.notificationsModel
      .findOneAndUpdate(
        { _id: data.notificationId },
        {
          [colName]: data[colName],
        },
        { new: true },
      )
      .exec();
    return rs;
  }
  async adminClearNotificationByUserId(userId: string) {
    const sendNotification = await this.notificationsModel
      .deleteMany({ sendId: userId })
      .exec();
    const receiveNotification = await this.notificationsModel
      .deleteMany({ receiveId: userId })
      .exec();
    return sendNotification.acknowledged && receiveNotification.acknowledged;
  }
}
