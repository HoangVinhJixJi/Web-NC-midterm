import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type EnrollmentDocument = HydratedDocument<Enrollment>;
@Schema({ collection: 'enrollment' })
export class Enrollment extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  classId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop()
  role: string;
  @Prop()
  joinAt: string;
}
export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
