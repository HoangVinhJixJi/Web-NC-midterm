import { IsNotEmpty, IsString } from 'class-validator';

export class AssignAccountStudentIdDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  studentId: string;
}
