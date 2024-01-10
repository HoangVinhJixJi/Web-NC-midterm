import { IsNotEmpty, IsString } from 'class-validator';

export class RestoreClassDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
}
