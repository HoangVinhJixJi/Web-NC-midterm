import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type ClassDocument = HydratedDocument<Class>;
@Schema({ collection: 'class' })
export class Class extends mongoose.Document {
  @Prop()
  className: string;
  @Prop()
  classCode: string;
  @Prop()
  description: string;
  @Prop()
  status: string;
  @Prop()
  createAt: string;
}
export const ClassSchema = SchemaFactory.createForClass(Class);
