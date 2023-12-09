import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateClassDto {
  @IsString()
  @IsNotEmpty()
  className: string;

  @IsString()
  description: string;
}
