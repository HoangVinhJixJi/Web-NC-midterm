import mongoose, { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ collection: 'user' })
export class User extends mongoose.Document {
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  email: string;
  @Prop()
  fullName: string;
  @Prop()
  gender: string;
  @Prop()
  birthday: string;
  @Prop()
  avatar: string;
  @Prop({ default: false })
  isActivated: boolean;
  @Prop({ default: null })
  activationToken: string;
  @Prop({ default: null })
  resetPasswordToken: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
