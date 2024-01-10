import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradesController } from './grades.controller';
import { GradeSchema } from './schema/grade.schema';
import { GradesService } from './grades.service';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AssignmentsModule } from '../assignments/assignments.module';
import { EventsModule } from 'src/gateway/events.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grade', schema: GradeSchema }]),
    EnrollmentsModule,
    NotificationsModule,
    AssignmentsModule,
    EventsModule,
  ],
  providers: [GradesService],
  exports: [GradesService],
  controllers: [GradesController],
})
export class GradesModule {}
