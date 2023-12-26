import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles/roles.guard';
import { Roles } from '../../../../auth/roles/roles.decorator';
import { Role } from '../../../../enums/role.enum';
import { AccountService } from './account.service';
import { BanUserDto } from './dto/ban-user.dto';
import { use } from 'passport';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin/management/account')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  async getAccounts(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('searchTerm') searchTerm: string,
    @Query('status') status: string,
    @Query('action') action: string,
  ) {
    const pageNumber = parseInt(page, 10) || PAGE_NUMBER_DEFAULT;
    const pageSizeNumber = parseInt(pageSize, 10) || PAGE_SIZE_NUMBER_DEFAULT;
    return this.accountService.getAccounts(
      pageNumber,
      pageSizeNumber,
      searchTerm,
      status,
      action,
    );
  }
  @Get('banned')
  async getBannedAccounts(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('searchTerm') searchTerm: string,
    @Query('totalDaysBanned') totalDaysBanned: string,
  ) {
    const pageNumber = parseInt(page, 10) || PAGE_NUMBER_DEFAULT;
    const pageSizeNumber = parseInt(pageSize, 10) || PAGE_SIZE_NUMBER_DEFAULT;
    return this.accountService.getBannedAccounts(
      pageNumber,
      pageSizeNumber,
      searchTerm,
      totalDaysBanned,
    );
  }
  @Post('ban')
  async banAccount(
    @Body(new ValidationPipe({ transform: true })) userData: BanUserDto,
  ) {
    return this.accountService.banAccount(
      userData.userId,
      userData.numOfDaysBanned,
    );
  }
  @Get('personal-info')
  async getPersonalInfo(@Query('username') username: string) {
    return this.accountService.getPersonalInfo(username);
  }
  @Get('account-info')
  async getAccountInfo(@Query('username') username: string) {
    return this.accountService.getAccountInfo(username);
  }
}
