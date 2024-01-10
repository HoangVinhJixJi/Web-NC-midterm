import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AssignmentsController } from './assignments.controller';
import { AssignmentSchema } from './schema/assignment.schema';
import { AssignmentsService } from './assignments.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Assignment', schema: AssignmentSchema },
    ]),
  ],
  providers: [AssignmentsService],
  exports: [AssignmentsService],
  controllers: [AssignmentsController],
})
export class AssignmentsModule {}
