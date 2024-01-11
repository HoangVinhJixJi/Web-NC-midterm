import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PostCommentDto {
  @IsString()
  @IsNotEmpty()
  sendName: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsBoolean()
  @IsNotEmpty()
  isTeaching: boolean;
}
