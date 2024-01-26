import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeStructuresController } from './gradeStructures.controller';
import { GradeStructureSchema } from './schema/gradeStructure.schema';
import { GradeStructuresService } from './gradeStructures.service';
import { UsersModule } from '../users/users.module';
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';
import { AssignmentsModule } from '../assignments/assignments.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GradeStructure', schema: GradeStructureSchema },
    ]),
    UsersModule,
    BannedUsersModule,
    AssignmentsModule,
  ],
  providers: [GradeStructuresService],
  exports: [GradeStructuresService],
  controllers: [GradeStructuresController],
})
export class GradeStructuresModule {}
