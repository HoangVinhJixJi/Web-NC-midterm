import { IsArray, IsNotEmpty, IsString } from 'class-validator';
import { AssignStudentIdDto } from './assign-student-id.dto';

export class AssignStudentIdToAllDto {
  @IsString()
  @IsNotEmpty()
  classId: string;

  @IsArray()
  importedData: Array<AssignStudentIdDto>;
}
