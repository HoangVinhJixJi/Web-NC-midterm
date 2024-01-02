import { IsNotEmpty, IsString } from 'class-validator';

export class PostCommentDto {
  @IsString()
  @IsNotEmpty()
  sendId: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
