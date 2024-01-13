import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsController } from './assignments.controller';
import { AssignmentSchema } from './schema/assignment.schema';
import { AssignmentsService } from './assignments.service';
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Assignment', schema: AssignmentSchema },
    ]),
    UsersModule,
    BannedUsersModule,
  ],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
  controllers: [AssignmentsController],
})
export class AssignmentsModule {}
