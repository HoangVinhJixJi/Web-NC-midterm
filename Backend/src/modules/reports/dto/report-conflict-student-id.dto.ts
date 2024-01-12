import { IsNotEmpty, IsString } from 'class-validator';

export class ReportConflictStudentIdDto {
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsString()
  @IsNotEmpty()
  extraInfo: string;
}
