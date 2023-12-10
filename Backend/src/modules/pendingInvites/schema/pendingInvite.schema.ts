import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type PendingInviteDocument = HydratedDocument<PendingInvite>;
@Schema({ collection: 'pendingInvite' })
export class PendingInvite extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  classId: mongoose.Schema.Types.ObjectId;
  @Prop()
  email: string;
  @Prop()
  role: string;
  @Prop({ default: null })
  inviteToken: string;
}
export const PendingInviteSchema = SchemaFactory.createForClass(PendingInvite);
