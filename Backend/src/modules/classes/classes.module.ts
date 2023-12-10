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
  ],
  providers: [ClassesService],
  exports: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
