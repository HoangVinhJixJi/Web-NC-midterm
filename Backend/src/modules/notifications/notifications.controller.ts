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
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';

@Roles(Role.User, Role.Admin)
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
    return await this.notificationsService.findAllByUserId(
      req.user.sub,
      'receive',
    );
  }
  @UseGuards(JwtAuthGuard)
  @Get('/get/send')
  async getAllNotificationsSend(@Request() req: any) {
    return await this.notificationsService.findAllByUserId(
      req.user.sub,
      'send',
    );
  }
  @Get('/get/type/:type')
  async getAllNotificationsByAssignmentId(
    @Request() req: any,
    @Param('type') type: string,
  ) {
    return this.notificationsService.findAllByColName('type', type);
  }
  // @Get('delete/all')
  // async deleteAll() {
  //   return this.notificationsService.deleteNotifications();
  // }
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
  @Post('/update/status')
  @UseGuards(JwtAuthGuard)
  async updateNotificationStatus(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    data: any,
  ): Promise<Notification> {
    //const userId = req.user.sub;
    const newNotification =
      await this.notificationsService.updateOneColNotification('status', data);
    return newNotification;
  }
}
