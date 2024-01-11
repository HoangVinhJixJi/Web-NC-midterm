import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGradeDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
  @IsString()
  @IsNotEmpty()
  assignmentId: string;
  @IsString()
  studentId: string;
  @IsNumber()
  score: number;
  @IsString()
  status: string;
}
