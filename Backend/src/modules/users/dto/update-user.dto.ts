import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
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
