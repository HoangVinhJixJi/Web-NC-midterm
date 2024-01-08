import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationSchema } from './schema/notification.schema';
import { NotificationsService } from './notifications.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { EventsModule } from 'src/gateway/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    EnrollmentsModule,
    EventsModule,
  ],
  providers: [NotificationsService],
  exports: [NotificationsService],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
