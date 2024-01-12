import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeStructuresController } from './gradeStructures.controller';
import { GradeStructureSchema } from './schema/gradeStructure.schema';
import { GradeStructuresService } from './gradeStructures.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GradeStructure', schema: GradeStructureSchema },
    ]),
  ],
  providers: [GradeStructuresService],
  exports: [GradeStructuresService],
  controllers: [GradeStructuresController],
})
export class GradeStructuresModule {}
