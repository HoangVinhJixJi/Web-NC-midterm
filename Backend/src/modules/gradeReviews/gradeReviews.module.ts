import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeReviewsService } from './gradeReviews.service';
import { GradeReviewSchema } from './schema/gradeReview.schema';
import { GradeReviewsController } from './gradeReviews.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { EventsModule } from 'src/gateway/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GradeReview', schema: GradeReviewSchema },
    ]),
    NotificationsModule,
    EnrollmentsModule,
    AssignmentsModule,
    EventsModule,
  ],
  providers: [GradeReviewsService],
  exports: [GradeReviewsService],
  controllers: [GradeReviewsController],
})
export class GradeReviewsModule {}
