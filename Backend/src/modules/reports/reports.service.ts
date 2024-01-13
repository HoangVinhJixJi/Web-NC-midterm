import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NotificationsService } from '../notifications/notifications.service';
import { EventsGateway } from '../../gateway/events.gateway';
import { Role } from '../../enums/role.enum';
import { NotificationTypeEnum } from '../../enums/notification-type.enum';
import { NotificationStatusEnum } from '../../enums/notification-status.enum';

@Injectable()
export class ReportsService {
  constructor(
    private usersService: UsersService,
    private notificationsService: NotificationsService,
    private eventsGateway: EventsGateway,
  ) {}
  async reportConflictStudentId(
    userId: any,
    studentId: string,
    extraInfo: string,
  ) {
    const adminList = await this.usersService.findUsersByRole(Role.Admin);
    if (adminList.length > 0) {
      let count: number = 0;
      for (const admin of adminList) {
        if (admin !== null) {
          const notiData = {
            receiveId: admin['_id'],
            message: `studentId=${studentId}&extraInfo=${extraInfo}`,
            type: NotificationTypeEnum.ReportConflictId,
            status: NotificationStatusEnum.Unread,
          };
          const newNoti = await this.notificationsService.createNotification(
            userId,
            notiData,
          );
          if (newNoti) {
            this.eventsGateway.handleEmitSocket({
              data: { newNoti },
              event: NotificationTypeEnum.ReportConflictId,
              to: admin['_id'],
            });
            count = count + 1;
          }
        }
      }
      if (count > 0) {
        return { message: 'Report successfully' };
      } else {
        throw new HttpException(
          'Send report to admin fail',
          HttpStatus.EXPECTATION_FAILED,
        );
      }
    }
    throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
  }
}
