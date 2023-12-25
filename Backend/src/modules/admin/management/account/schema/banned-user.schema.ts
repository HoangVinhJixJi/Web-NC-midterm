import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type BannedUserDocument = HydratedDocument<BannedUser>;
@Schema({ collection: 'bannedUser' })
export class BannedUser extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  userId: mongoose.Schema.Types.ObjectId;
  @Prop()
  username: string;
  @Prop()
  numOfDaysBanned: number;
  @Prop()
  bannedStartTime: Date;
  @Prop()
  bannedEndTime: Date;
}
export const BannedUserSchema = SchemaFactory.createForClass(BannedUser);
