import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';
import { EnrollmentSchema } from '../enrollments/schema/enrollment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      { name: 'Enrollment', schema: EnrollmentSchema },
    ]),
    BannedUsersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
