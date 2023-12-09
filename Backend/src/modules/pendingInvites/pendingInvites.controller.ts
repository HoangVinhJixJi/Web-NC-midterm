import { Controller, Get, Param, Request } from '@nestjs/common';
import { PendingInvitesService } from './pendingInvites.service';

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
