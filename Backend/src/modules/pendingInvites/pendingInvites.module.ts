import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PendingInvitesController } from './pendingInvites.controller';
import { PendingInviteSchema } from './schema/pendingInvite.schema';
import { PendingInvitesService } from './pendingInvites.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PendingInvite', schema: PendingInviteSchema },
    ]),
  ],
  providers: [PendingInvitesService],
  exports: [PendingInvitesService],
  controllers: [PendingInvitesController],
})
export class PendingInvitesModule {}
