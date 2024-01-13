import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannedUserSchema } from '../schema/banned-user.schema';
import { BannedUsersService } from './banned-users.service';
import { UserSchema } from '../../../../users/schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BannedUser', schema: BannedUserSchema },
      { name: 'User', schema: UserSchema },
    ]),
  ],
  providers: [BannedUsersService],
  exports: [BannedUsersService],
})
export class BannedUsersModule {}
