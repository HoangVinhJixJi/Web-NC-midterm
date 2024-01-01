import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles/roles.guard';
import { Roles } from '../../../../auth/roles/roles.decorator';
import { Role } from '../../../../enums/role.enum';
import { ClassService } from './class.service';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/management/class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get('')
  async getClasses(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('searchTerm') searchTerm: string,
    @Query('status') status: string,
    @Query('action') action: string,
    @Query('sortedBy') sortedBy: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const pageNumber = parseInt(page, 10) || PAGE_NUMBER_DEFAULT;
    const pageSizeNumber = parseInt(pageSize, 10) || PAGE_SIZE_NUMBER_DEFAULT;
    return this.classService.getClasses(
      pageNumber,
      pageSizeNumber,
      searchTerm,
      status,
      action,
      sortedBy,
      sortOrder,
    );
  }
}
