import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradesController } from './grades.controller';
import { GradeSchema } from './schema/grade.schema';
import { GradesService } from './grades.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Grade', schema: GradeSchema }]),
  ],
  providers: [GradesService],
  exports: [GradesService],
  controllers: [GradesController],
})
export class GradesModule {}
