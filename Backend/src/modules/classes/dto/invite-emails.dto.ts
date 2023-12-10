import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class InviteEmailsDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  userEmail: string;

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  invitedEmail: string;

  @IsString()
  @IsNotEmpty()
  role: string;
}
