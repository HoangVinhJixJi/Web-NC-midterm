import { IsNotEmpty, IsString } from 'class-validator';

export class BanUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  reason: string;

  @IsString()
  @IsNotEmpty()
  numOfDaysBanned: string;
}
