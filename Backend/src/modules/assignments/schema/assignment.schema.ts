import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ClassDocument = HydratedDocument<Assignment>;
@Schema({ collection: 'assignment' })
export class Assignment extends mongoose.Document {
  @Prop()
  assignmentName: string;
  @Prop()
  assignmentContent: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  classId: mongoose.Schema.Types.ObjectId;
  @Prop()
  maxScore: number;
  @Prop()
  createAt: string;
  @Prop()
  gradeStructureId: string;
}
export const AssignmentSchema = SchemaFactory.createForClass(Assignment);
