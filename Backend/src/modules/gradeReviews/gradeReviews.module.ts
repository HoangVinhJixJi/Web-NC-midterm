import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeReviewsService } from './gradeReviews.service';
import { GradeReviewSchema } from './schema/gradeReview.schema';
import { GradeReviewsController } from './gradeReviews.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { EventsModule } from 'src/gateway/events.module';
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GradeReview', schema: GradeReviewSchema },
    ]),
    NotificationsModule,
    EnrollmentsModule,
    AssignmentsModule,
    EventsModule,
    BannedUsersModule,
    UsersModule,
  ],
  providers: [GradeReviewsService],
  exports: [GradeReviewsService],
  controllers: [GradeReviewsController],
})
export class GradeReviewsModule {}
