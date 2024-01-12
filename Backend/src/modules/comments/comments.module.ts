import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentSchema } from './schema/comment.schema';
import { CommentsService } from './comments.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { GradeReviewsModule } from '../gradeReviews/gradeReviews.module';
import { EventsModule } from 'src/gateway/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    NotificationsModule,
    EnrollmentsModule,
    AssignmentsModule,
    GradeReviewsModule,
    EventsModule,
  ],
  providers: [CommentsService],
  exports: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
