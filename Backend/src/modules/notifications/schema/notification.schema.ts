import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type NotificationDocument = HydratedDocument<Notification>;
@Schema({ collection: 'notification' })
export class Notification extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sendId: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiveId: string;
  @Prop()
  message: string;
  @Prop()
  type: string;
  @Prop()
  status: string;
  @Prop()
  createAt: string;
}
export const NotificationSchema = SchemaFactory.createForClass(Notification);
