import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Comment } from './schema/comment.schema';
import { PostCommentDto } from './dto/post-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(JwtAuthGuard)
  @Get('gradeReviewId/:gradeReviewId')
  async getAllByGradeReviewId(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
  ) {
    return this.commentsService.findAllByGradeReviewId(gradeReviewId);
  }
  @UseGuards(JwtAuthGuard)
  @Get('sendId/:sendId')
  async getAllBySendId(@Request() req: any, @Param('sendId') sendId: string) {
    return this.commentsService.findAllBySendId(sendId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('post/:gradeReviewId')
  async postComment(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: PostCommentDto,
  ): Promise<Comment> {
    return this.commentsService.add(gradeReviewId, userData);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('delete/:commentId')
  async deleteComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.delete(commentId);
  }
}
