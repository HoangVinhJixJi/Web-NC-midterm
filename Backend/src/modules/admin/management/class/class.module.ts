import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { ClassesModule } from '../../../classes/classes.module';
import { UsersModule } from '../../../users/users.module';
import { BannedUsersModule } from '../account/banned-users/banned-users.module';

@Module({
  imports: [UsersModule, ClassesModule, BannedUsersModule],
  providers: [ClassService],
  controllers: [ClassController],
  exports: [ClassService],
})
export class ClassModule {}
