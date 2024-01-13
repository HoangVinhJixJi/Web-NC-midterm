import { IsNotEmpty, IsString } from 'class-validator';

export class UnbanUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
}
