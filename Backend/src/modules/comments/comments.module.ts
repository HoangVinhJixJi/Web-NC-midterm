import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentsController } from './comments.controller';
import { CommentSchema } from './schema/comment.schema';
import { CommentsService } from './comments.service';
import { NotificationsModule } from '../notifications/notifications.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { GradeReviewsModule } from '../gradeReviews/gradeReviews.module';
import { EventsModule } from 'src/gateway/events.module';
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    NotificationsModule,
    EnrollmentsModule,
    forwardRef(() => AssignmentsModule),
    forwardRef(() => GradeReviewsModule),
    EventsModule,
    BannedUsersModule,
    UsersModule,
  ],
  providers: [CommentsService],
  exports: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
