import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { PendingInvitesService } from './pendingInvites.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';

@Controller('pendingInvites')
export class PendingInvitesController {
  constructor(private readonly pendingInvitesService: PendingInvitesService) {}
  @UseGuards(JwtAuthGuard)
  @Get(':classId')
  async getAllEmailsByClassId(
    @Request() req: any,
    @Param('classId') classId: string,
  ) {
    return this.pendingInvitesService.findAllByClassId(classId);
  }
}
