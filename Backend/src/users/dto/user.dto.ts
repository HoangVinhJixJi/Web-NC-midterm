import { IsEmail, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class UserDto {
  userId: mongoose.Schema.Types.ObjectId;

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
