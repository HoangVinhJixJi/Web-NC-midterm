import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateGradeCompositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  scale: number;
}
