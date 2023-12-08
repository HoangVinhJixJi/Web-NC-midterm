import { IsNotEmpty, IsString } from 'class-validator';

export class ClassInfoDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
}
