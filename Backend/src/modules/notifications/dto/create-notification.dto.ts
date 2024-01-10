import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotiDto {
  @IsNotEmpty()
  @IsString()
  receiveId: string;
  @IsString()
  type: string;
  @IsString()
  message: string;
  @IsString()
  status: string;
}
