import { IsNotEmpty, IsString } from 'class-validator';

export class ArchiveClassDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
}
