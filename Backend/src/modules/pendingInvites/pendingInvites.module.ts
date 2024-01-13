import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PendingInvitesController } from './pendingInvites.controller';
import { PendingInviteSchema } from './schema/pendingInvite.schema';
import { PendingInvitesService } from './pendingInvites.service';
import { BannedUsersModule } from '../admin/management/account/banned-users/banned-users.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'PendingInvite', schema: PendingInviteSchema },
    ]),
    UsersModule,
    BannedUsersModule,
  ],
  providers: [PendingInvitesService],
  exports: [PendingInvitesService],
  controllers: [PendingInvitesController],
})
export class PendingInvitesModule {}
