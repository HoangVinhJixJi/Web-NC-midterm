import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { Comment } from './schema/comment.schema';
import { PostCommentDto } from './dto/post-comment.dto';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Roles(Role.User)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('gradeReviewId/:gradeReviewId')
  async getAllByGradeReviewId(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
  ) {
    return this.commentsService.findAllByGradeReviewId(gradeReviewId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('sendId/:sendId')
  async getAllBySendId(@Request() req: any, @Param('sendId') sendId: string) {
    return this.commentsService.findAllBySendId(sendId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Post('post/:gradeReviewId')
  async postComment(
    @Request() req: any,
    @Param('gradeReviewId') gradeReviewId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: PostCommentDto,
  ): Promise<Comment> {
    const sendId = req.user.sub;
    return this.commentsService.add(gradeReviewId, sendId, userData);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Delete('delete/:commentId')
  async deleteComment(
    @Request() req: any,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.delete(commentId);
  }
}
