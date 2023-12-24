import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles/roles.guard';
import { Roles } from '../../../../auth/roles/roles.decorator';
import { Role } from '../../../../enums/role.enum';
import { AccountService } from './account.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/management/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccounts(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page, 10) || 1;
    const pageSizeNumber = parseInt(pageSize, 10) || 8;
    return this.accountService.getAccounts(pageNumber, pageSizeNumber);
  }
}
