import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { PendingInvitesService } from './pendingInvites.service';

@Controller('pendingInvites')
@UseGuards(JwtAuthGuard)
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
