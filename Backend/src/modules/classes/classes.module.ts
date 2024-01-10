import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema } from './schema/class.schema';
import { UserSchema } from '../users/schema/user.schema';
import { ClassesController } from './classes.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { PendingInvitesModule } from '../pendingInvites/pendingInvites.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from 'src/auth/auth.module';
<<<<<<< HEAD
import { EventsModule } from 'src/gateway/events.module';
=======
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';
>>>>>>> dca31a6edfb7b6feb4081e149da8cb7cfd522ae8

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Class', schema: ClassSchema },
      { name: 'User', schema: UserSchema },
    ]),
    EnrollmentsModule,
    PendingInvitesModule,
    UsersModule,
    AuthModule,
<<<<<<< HEAD
    EventsModule,
=======
    BannedUsersModule,
>>>>>>> dca31a6edfb7b6feb4081e149da8cb7cfd522ae8
  ],
  providers: [ClassesService],
  exports: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
