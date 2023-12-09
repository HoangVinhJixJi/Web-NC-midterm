import { IsEmail, IsString } from 'class-validator';

export class UserDto {
  @IsString()
  userId: string;

  @IsString()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  fullName: string;

  @IsString()
  gender: string;

  @IsString()
  birthday: string;

  @IsString()
  avatar: string;
}
