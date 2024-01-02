import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class AddGradeReviewDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsNumber()
  @IsNotEmpty()
  currentGrade: number;

  @IsNumber()
  @IsNotEmpty()
  expectedGrade: number;

  @IsString()
  @IsNotEmpty()
  message: string;
}
