import { Injectable } from '@nestjs/common';
import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type EnrollmentDocument = HydratedDocument<Enrollment>;
@Injectable()
export class Enrollment extends mongoose.Document {
  @Prop()
  classId: string;
  @Prop()
  userId: string;
  @Prop()
  role: string;
  @Prop()
  joinAt: string;
}
export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
