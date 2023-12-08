import { Module } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EnrollmentSchema } from './schema/enrollment.schema';
import { EnrollmentsController } from './enrollments.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Enrollment', schema: EnrollmentSchema },
    ]),
  ],
  providers: [EnrollmentsService],
  exports: [EnrollmentsService],
  controllers: [EnrollmentsController],
})
export class EnrollmentsModule {}
