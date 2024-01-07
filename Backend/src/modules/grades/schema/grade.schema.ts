import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ClassDocument = HydratedDocument<Grade>;
@Schema({ collection: 'grade' })
export class Grade extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  classId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' })
  assignmentId: string;
  @Prop()
  studentId: string;
  @Prop()
  score: number;
  @Prop()
  status: string;
}
export const GradeSchema = SchemaFactory.createForClass(Grade);
