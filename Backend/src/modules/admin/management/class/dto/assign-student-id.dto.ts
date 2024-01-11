import { IsNotEmpty, IsString } from 'class-validator';

export class AssignStudentIdDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;
}
