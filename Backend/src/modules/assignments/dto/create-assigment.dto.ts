import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAssignmentDto {
  @IsString()
  @IsNotEmpty()
  assignmentName: string;
  @IsString()
  assignmentContent: string;
  @IsString()
  classId: string;
  @IsNumber()
  maxScore: number;
  @IsString()
  gradeStructureId: string;
}
