import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BannedUser } from '../schema/banned-user.schema';
import { AccountService } from '../account.service';

@Injectable()
export class BannedUsersService {
  constructor(
    @InjectModel('BannedUser') private bannedUserModel: Model<BannedUser>,
    private accountService: AccountService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAndUnbanExpiredBanAccounts() {
    const currentTime = new Date();
    console.log(currentTime.toISOString());
    const expiredBans = await this.bannedUserModel
      .find({ bannedEndTime: { $lte: currentTime.toISOString() } })
      .exec();
    console.log(expiredBans.length);
    for (const ban of expiredBans) {
      await this.accountService.unbanAccount(ban.userId.toString());
    }
  }
}
