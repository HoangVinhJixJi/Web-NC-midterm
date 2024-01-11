import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GradeStructuresService } from './gradeStructures.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AddGradeCompositionDto } from './dto/add-gradeCompostion.dto';
import { UpdateGradeCompositionDto } from './dto/update-gradeCompostion.dto';
import { GradeStructure } from './schema/gradeStructure.schema';

@Controller('gradeStructures')
export class GradeStructuresController {
  constructor(
    private readonly gradeStructuresService: GradeStructuresService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get(':classId')
  async getAllGradeStructures(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.gradeStructuresService.findAllByClassId(classId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('add/:classId')
  async addGradeComposition(
    @Request() req: any,
    @Param('classId') classId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: AddGradeCompositionDto,
  ): Promise<GradeStructure> {
    return this.gradeStructuresService.add(classId, userData);
  }
  @UseGuards(JwtAuthGuard)
  @Delete('remove/:gradeStructureId')
  async removeGradeComposition(
    @Request() req: any,
    @Param('gradeStructureId') gradeStructureId: string,
  ) {
    return this.gradeStructuresService.delete(gradeStructureId);
  }
  @UseGuards(JwtAuthGuard)
  @Post('update/:gradeStructureId')
  async updateGradeComposition(
    @Request() req: any,
    @Param('gradeStructureId') gradeStructureId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: UpdateGradeCompositionDto,
  ) {
    return this.gradeStructuresService.findOneAndUpdate(
      gradeStructureId,
      userData,
    );
  }
}
