import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class UpdateGradeReviewDto {
  @IsNumber()
  @IsNotEmpty()
  finalGrade: number;

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  sendName: string;
}
