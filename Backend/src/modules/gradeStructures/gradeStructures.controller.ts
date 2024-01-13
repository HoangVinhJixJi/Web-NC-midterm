import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { GradeStructuresService } from './gradeStructures.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AddGradeCompositionDto } from './dto/add-gradeCompostion.dto';
import { UpdateGradeCompositionDto } from './dto/update-gradeCompostion.dto';
import { GradeStructure } from './schema/gradeStructure.schema';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';

@Roles(Role.User)
@Controller('gradeStructures')
export class GradeStructuresController {
  constructor(
    private readonly gradeStructuresService: GradeStructuresService,
  ) {}
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get(':classId')
  async getAllGradeStructures(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.gradeStructuresService.findAllByClassId(classId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Get('detail/:gradeStructureId')
  async getGradeStructureById(
    @Request() req: any,
    @Param('gradeStructureId') gradeStructureId: string,
  ) {
    return this.gradeStructuresService.findOneById(gradeStructureId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Post('add/:classId')
  async addGradeComposition(
    @Request() req: any,
    @Param('classId') classId: string,
    @Body(new ValidationPipe({ transform: true }))
    userData: AddGradeCompositionDto,
  ): Promise<GradeStructure> {
    return this.gradeStructuresService.add(classId, userData);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
  @Delete('remove/:gradeStructureId')
  async removeGradeComposition(
    @Request() req: any,
    @Param('gradeStructureId') gradeStructureId: string,
  ) {
    return this.gradeStructuresService.delete(gradeStructureId);
  }
  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
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
