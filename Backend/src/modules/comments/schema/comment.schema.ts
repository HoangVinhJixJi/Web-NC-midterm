import mongoose, { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type CommentDocument = HydratedDocument<Comment>;
@Schema({ collection: 'comment' })
export class Comment extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'GradeReview' })
  gradeReviewId: mongoose.Schema.Types.ObjectId;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sendId: mongoose.Schema.Types.ObjectId;
  @Prop()
  sendName: string;
  @Prop()
  message: string;
  @Prop()
  postAt: string;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
