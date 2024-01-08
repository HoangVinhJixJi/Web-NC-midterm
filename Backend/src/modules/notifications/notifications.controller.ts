import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
// import { ClassesService } from '../classes/classes.service';
// import { EnrollmentsService } from '../enrollments/enrollments.service';
// import { AuthService } from 'src/auth/auth.service';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from '../users/users.service';
import { Notification } from './schema/notification.schema';
import { CreateNotiDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/get/all')
  async getAllNotifications(@Request() req: any) {
    const userId = req.user.sub;
    const send = await this.notificationsService.findAllByUserId(
      userId,
      'send',
    );
    const receive = await this.notificationsService.findAllByUserId(
      userId,
      'receive',
    );
    return send.concat(receive);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/get/receive')
  async getAllNotificationsReceive(@Request() req: any) {
    return this.notificationsService.findAllByUserId(req.userId, 'receive');
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get/send')
  async getAllNotificationsSend(
    @Request() req: any,
    @Param('userId') userId: string,
  ) {
    return this.notificationsService.findAllByUserId(userId, 'send');
  }
  @Get('/get/type/:type')
  async getAllNotificationsByAssignmentId(
    @Request() req: any,
    @Param('type') type: string,
  ) {
    return this.notificationsService.findAllByColName('type', type);
  }
  @Post('/send/all/:classId')
  @UseGuards(JwtAuthGuard)
  async sendNotificationAllClass(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    notiData: CreateNotiDto,
    @Param('classId') classId: string,
  ): Promise<Notification[]> {
    const userId = req.user.sub;
    const newNotification =
      await this.notificationsService.createNotificationForEntireClass(
        userId,
        classId,
        notiData,
      );
    return newNotification;
  }
  @Post('/send')
  @UseGuards(JwtAuthGuard)
  async sendNotification(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    NotificationData: CreateNotiDto,
  ): Promise<Notification> {
    const userId = req.user.sub;
    const newNotification = await this.notificationsService.createNotification(
      userId,
      NotificationData,
    );
    return newNotification;
  }
}
