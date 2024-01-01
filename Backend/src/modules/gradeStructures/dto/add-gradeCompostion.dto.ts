import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddGradeCompositionDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  scale: number;
}
