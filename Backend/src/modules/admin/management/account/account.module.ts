import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersModule } from '../../../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AccountService],
  controllers: [AccountController],
})
export class AccountModule {}
