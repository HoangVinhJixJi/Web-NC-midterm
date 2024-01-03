import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment } from './schema/comment.schema';
import { PostCommentDto } from './dto/post-comment.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel('Comment')
    private commentsModel: Model<Comment>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async add(gradeReviewId: string, userData: PostCommentDto) {
    const newComment = {
      gradeReviewId: gradeReviewId,
      sendId: userData.sendId,
      sendName: userData.sendName,
      message: userData.message,
      postAt: new Date().toString(),
    };
    const createComment = new this.commentsModel(newComment);
    return createComment.save();
  }
  async delete(commentId: string): Promise<Comment | null> {
    try {
      return await this.commentsModel
        .findOneAndDelete({ _id: commentId })
        .exec();
    } catch (error) {
      throw new Error(error);
    }
  }
  async findAllByGradeReviewId(gradeReviewId: string): Promise<Comment[]> {
    return await this.commentsModel.find({ gradeReviewId }).exec();
  }
  async findAllBySendId(sendId: string): Promise<Comment[]> {
    return await this.commentsModel.find({ sendId }).exec();
  }
}
