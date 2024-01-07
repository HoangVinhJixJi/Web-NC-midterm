import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BannedUserSchema } from '../schema/banned-user.schema';
import { BannedUsersService } from './banned-users.service';
import { AccountModule } from '../account.module';
import { UsersModule } from '../../../../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BannedUser', schema: BannedUserSchema },
    ]),
    UsersModule,
  ],
  providers: [BannedUsersService],
  exports: [BannedUsersService],
})
export class BannedUsersModule {}
