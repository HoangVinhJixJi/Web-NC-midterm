import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PendingInviteDocument = HydratedDocument<GradeStructure>;
@Schema({ collection: 'gradeStructure' })
export class GradeStructure extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  classId: mongoose.Schema.Types.ObjectId;
  @Prop()
  name: string;
  @Prop()
  scale: number;
}
export const GradeStructureSchema =
  SchemaFactory.createForClass(GradeStructure);
