import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type GradeReviewDocument = HydratedDocument<GradeReview>;
@Schema({ collection: 'gradeReview' })
export class GradeReview extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' })
  assignmentId: mongoose.Schema.Types.ObjectId;
  @Prop({ ref: 'User' })
  studentId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  classId: mongoose.Schema.Types.ObjectId;
  @Prop()
  expectedGrade: number;
  @Prop({ default: null })
  finalGrade: number;
  @Prop()
  message: string;
  @Prop({ default: 'open' })
  status: string;
}
export const GradeReviewSchema = SchemaFactory.createForClass(GradeReview);
