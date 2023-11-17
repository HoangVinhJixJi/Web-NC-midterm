import mongoose, { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = HydratedDocument<User>;
@Schema({ collection: 'user' })
export class User {
  @Prop()
  userId: mongoose.Schema.Types.ObjectId;
  @Prop()
  username: string;
  @Prop()
  password: string;
  @Prop()
  email: string;
  @Prop()
  fullName: string;
  @Prop()
  age: number;
  @Prop()
  gender: string;
  @Prop()
  birthday: string;
  @Prop()
  avatar: string;
}
export const UserSchema = SchemaFactory.createForClass(User);
