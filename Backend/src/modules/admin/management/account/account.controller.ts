import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../../auth/jwt/jwt-auth.guard';
import { RolesGuard } from '../../../../auth/roles/roles.guard';
import { Roles } from '../../../../auth/roles/roles.decorator';
import { Role } from '../../../../enums/role.enum';
import { AccountService } from './account.service';
import { BanUserDto } from './dto/ban-user.dto';
import { UnbanUserDto } from './dto/unban-user.dto';
import { AssignAccountStudentIdDto } from './dto/assign-account-student-id.dto';
import { AccountStatusGuard } from '../../../../auth/account-status/account-status.guard';
import { ResolveConflictStudentIdDto } from './dto/resolve-conflict-student-id.dto';
import { ActiveUserDto } from './dto/active-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;

@UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
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
    @Query('sortedBy') sortedBy: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const pageNumber = parseInt(page, 10) || PAGE_NUMBER_DEFAULT;
    const pageSizeNumber = parseInt(pageSize, 10) || PAGE_SIZE_NUMBER_DEFAULT;
    return this.accountService.getAccounts(
      pageNumber,
      pageSizeNumber,
      searchTerm,
      status,
      action,
      sortedBy,
      sortOrder,
    );
  }
  @Get('banned')
  async getBannedAccounts(
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
    @Query('searchTerm') searchTerm: string,
    @Query('totalDaysBanned') totalDaysBanned: string,
    @Query('sortedBy') sortedBy: string,
    @Query('sortOrder') sortOrder: string,
  ) {
    const pageNumber = parseInt(page, 10) || PAGE_NUMBER_DEFAULT;
    const pageSizeNumber = parseInt(pageSize, 10) || PAGE_SIZE_NUMBER_DEFAULT;
    return this.accountService.getBannedAccounts(
      pageNumber,
      pageSizeNumber,
      searchTerm,
      totalDaysBanned,
      sortedBy,
      sortOrder,
    );
  }
  @Post('active')
  async activeAccount(
    @Body(new ValidationPipe({ transform: true })) userData: ActiveUserDto,
  ) {
    return this.accountService.activeAccount(userData.userId);
  }
  @Post('ban')
  async banAccount(
    @Body(new ValidationPipe({ transform: true })) userData: BanUserDto,
  ) {
    return this.accountService.banAccount(
      userData.userId,
      userData.reason,
      userData.numOfDaysBanned,
    );
  }
  @Post('unban')
  async unbanAccount(
    @Body(new ValidationPipe({ transform: true })) userData: UnbanUserDto,
  ) {
    return this.accountService.unbanAccount(userData.userId);
  }
  @Post('delete')
  async deleteAccount(
    @Body(new ValidationPipe({ transform: true })) userData: DeleteUserDto,
  ) {
    return this.accountService.deleteAccount(userData.userId);
  }
  @Get('personal-info')
  async getPersonalInfo(@Query('username') username: string) {
    return this.accountService.getPersonalInfo(username);
  }
  @Get('account-info')
  async getAccountInfo(@Query('username') username: string) {
    return this.accountService.getAccountInfo(username);
  }
  @Get('user-classes')
  async getUserClasses(
    @Query('username') username: string,
    @Query('classType') classType: string,
    @Query('searchTerm') searchTerm: string,
    @Query('page') page: string,
    @Query('pageSize') pageSize: string,
  ) {
    const pageNumber = parseInt(page, 10) || PAGE_NUMBER_DEFAULT;
    const pageSizeNumber = parseInt(pageSize, 10) || PAGE_SIZE_NUMBER_DEFAULT;
    return this.accountService.getUserClasses(
      username,
      classType,
      searchTerm,
      pageNumber,
      pageSizeNumber,
    );
  }
  @Post('assign-student-id')
  async assignStudentId(
    @Body(new ValidationPipe({ transform: true }))
    userData: AssignAccountStudentIdDto,
  ) {
    return this.accountService.assignStudentId(
      userData.userId,
      userData.studentId,
    );
  }
  @Post('assign-student-ids')
  async assignStudentIds(
    @Body(new ValidationPipe({ transform: true }))
    userData: Array<AssignAccountStudentIdDto>,
  ) {
    return this.accountService.assignStudentIds(userData);
  }
  @Get('report-conflict-id')
  async getConflictStudentIdUsers(
    @Query('sendId') sendId: string,
    @Query('studentId') studentId: string,
  ) {
    return this.accountService.getConflictStudentIdUsers(sendId, studentId);
  }
  @Post('resolve-conflict-id')
  async resolveConflictStudentId(
    @Request() req: any,
    @Body(new ValidationPipe({ transform: true }))
    userData: ResolveConflictStudentIdDto,
  ) {
    const adminId = req.user.sub;
    const adminUsername = req.user.username;
    return this.accountService.resolveConflictStudentId(
      adminId,
      adminUsername,
      userData.notificationId,
      userData.selectedUserId,
      userData.userIdList,
      userData.studentId,
    );
  }
  @Get('add-creator-to-class')
  async addCreatorToClass() {
    return this.accountService.addCreatorToClass();
  }
}
