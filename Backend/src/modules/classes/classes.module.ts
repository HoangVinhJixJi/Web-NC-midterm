import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ClassSchema } from './schema/class.schema';
import { ClassesController } from './classes.controller';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    EnrollmentsModule,
    UsersModule,
    MongooseModule.forFeature([{ name: 'Class', schema: ClassSchema }]),
  ],
  providers: [ClassesService],
  exports: [ClassesService],
  controllers: [ClassesController],
})
export class ClassesModule {}
