import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteClassDto {
  @IsString()
  @IsNotEmpty()
  classId: string;
}
