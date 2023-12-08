import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema } from './schema/class.schema';
import { ClassesController } from './classes.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
    EnrollmentsModule,
  ],
  providers: [ClassesService],
  exports: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
