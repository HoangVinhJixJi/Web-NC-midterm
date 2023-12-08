import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { Class } from './schema/class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { ClassesService } from './classes.service';

@Controller('classes')
@UseGuards(JwtAuthGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}
  @Post('create')
  async createNewClass(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true })) userData: CreateClassDto,
  ): Promise<Class> {
    const userId = req.user.sub;
    console.log(userId);
    return this.classesService.create(userData, userId);
  }
}
