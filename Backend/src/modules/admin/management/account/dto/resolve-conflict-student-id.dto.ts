import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class ResolveConflictStudentIdDto {
  @IsString()
  @IsNotEmpty()
  notificationId: string;

  @IsString()
  @IsNotEmpty()
  selectedUserId: string;

  @IsArray()
  userIdList: Array<string>;

  @IsString()
  @IsNotEmpty()
  studentId: string;
}
