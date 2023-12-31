import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BannedUser } from '../schema/banned-user.schema';
import { UsersService } from '../../../../users/users.service';

@Injectable()
export class BannedUsersService {
  constructor(
    @InjectModel('BannedUser') private bannedUserModel: Model<BannedUser>,
    private usersService: UsersService,
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
      const unbanUser = await this.bannedUserModel.findOneAndDelete({
        userId: ban.userId,
      });
      if (unbanUser) {
        return this.usersService.updateUserByField(
          unbanUser.userId.toString(),
          {
            isActivated: true,
            isBanned: false,
          },
        );
      }
    }
  }
  async getOneById(userId: any) {
    return this.bannedUserModel.findOne({ userId: userId }).exec();
  }
}
