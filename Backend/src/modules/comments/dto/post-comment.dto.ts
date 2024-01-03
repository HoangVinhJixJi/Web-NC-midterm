import { IsNotEmpty, IsString } from 'class-validator';

export class PostCommentDto {
  @IsString()
  @IsNotEmpty()
  sendId: string;

  @IsString()
  @IsNotEmpty()
  sendName: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
