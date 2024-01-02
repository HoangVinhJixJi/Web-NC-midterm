import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeReviewsService } from './gradeReviews.service';
import { GradeReviewSchema } from './schema/gradeReview.schema';
import { GradeReviewsController } from './gradeReviews.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'GradeReview', schema: GradeReviewSchema },
    ]),
  ],
  providers: [GradeReviewsService],
  exports: [GradeReviewsService],
  controllers: [GradeReviewsController],
})
export class GradeReviewsModule {}
