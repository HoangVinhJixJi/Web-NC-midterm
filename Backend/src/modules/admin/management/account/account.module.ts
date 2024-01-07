import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersModule } from '../../../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { BannedUserSchema } from './schema/banned-user.schema';
import { ClassesModule } from '../../../classes/classes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'BannedUser', schema: BannedUserSchema },
    ]),
    UsersModule,
    ClassesModule,
  ],
  providers: [AccountService],
  controllers: [AccountController],
  exports: [AccountService],
})
export class AccountModule {}