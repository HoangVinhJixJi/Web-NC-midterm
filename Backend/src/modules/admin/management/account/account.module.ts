import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersModule } from '../../../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BannedUserSchema } from './schema/banned-user.schema';
import { ClassesModule } from '../../../classes/classes.module';
import { BannedUsersModule } from './banned-users/banned-users.module';
import { NotificationsModule } from '../../../notifications/notifications.module';
import { EventsModule } from '../../../../gateway/events.module';
import { CommentsModule } from '../../../comments/comments.module';
import { EnrollmentsModule } from '../../../enrollments/enrollments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BannedUser', schema: BannedUserSchema },
    ]),
    UsersModule,
    ClassesModule,
    BannedUsersModule,
    NotificationsModule,
    EventsModule,
    CommentsModule,
    EnrollmentsModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}
