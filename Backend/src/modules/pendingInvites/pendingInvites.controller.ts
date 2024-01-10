import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { PendingInvitesService } from './pendingInvites.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { AccountStatusGuard } from '../../auth/account-status/account-status.guard';
import { RolesGuard } from '../../auth/roles/roles.guard';
import { Roles } from '../../auth/roles/roles.decorator';
import { Role } from '../../enums/role.enum';

@UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard)
@Roles(Role.User)
@Controller('pendingInvites')
export class PendingInvitesController {
  constructor(private readonly pendingInvitesService: PendingInvitesService) {}
  @Get(':classId')
  async getAllEmailsByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.pendingInvitesService.findAllByClassId(classId);
  }
}
