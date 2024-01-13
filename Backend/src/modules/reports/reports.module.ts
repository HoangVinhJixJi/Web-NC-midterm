import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { EventsModule } from '../../gateway/events.module';
import { UsersModule } from '../users/users.module';
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';

@Module({
  imports: [UsersModule, NotificationsModule, EventsModule, BannedUsersModule],
  providers: [ReportsService],
  exports: [ReportsService],
})
export class ReportsModule {}
