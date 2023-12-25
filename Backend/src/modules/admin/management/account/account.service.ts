import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { Model } from 'mongoose';
import { BannedUser } from './schema/banned-user.schema';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('BannedUser') private bannedUserModel: Model<BannedUser>,
    private usersService: UsersService,
  ) {}

  async getAccounts(
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
    status: string = '',
  ) {
    const skip = (page - 1) * pageSize;
    const filter = status !== '' ? { status } : {};
    const result = await this.usersService.getUserListByPage(
      {
        skip,
        take: pageSize,
      },
      filter,
    );
    const accounts = result.users.map((user) => {
      let resUser: any = {
        userId: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
      };
      if (status === '') {
        resUser = {
          ...resUser,
          status: user.isActivated
            ? 'Active'
            : user.isBanned
              ? 'Banned'
              : 'Pending',
        };
      }
      return resUser;
    });
    return { totalPages: result.totalPages, accounts };
  }
  async banAccount(userId: string, numOfDaysBanned: any) {
    const user = await this.usersService.updateUserByField(userId, {
      isActivated: false,
      isBanned: true,
    });
    if (user && !user.isActivated && user.isBanned) {
      console.log(user);
      const username = user.username;
      const currentTimes = new Date();
      const bannedDaysNumber = parseInt(numOfDaysBanned, 10) || 'Forever';
      let expiredBans: any = null;
      if (typeof bannedDaysNumber === 'number') {
        expiredBans = dayjs(currentTimes)
          .add(bannedDaysNumber, 'days')
          .startOf('second')
          .toDate();
      }
      const newBannedUser = {
        userId,
        username,
        numOfDaysBanned,
        bannedStartTime: currentTimes,
        bannedEndTime: expiredBans,
      };
      const createBannedUser = new this.bannedUserModel(newBannedUser);
      return createBannedUser.save();
    }
    throw new HttpException(
      'Account ban failed',
      HttpStatus.EXPECTATION_FAILED,
    );
  }
  async getBannedAccounts(
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
  ) {
    const skip = (page - 1) * pageSize;
    return await this.getBannedAccountListByPage(
      {
        skip,
        take: pageSize,
      },
      { role: { $ne: 'admin' } },
    );
  }
  private async getBannedAccountListByPage(
    param: { take: number; skip: number },
    filter: any = {},
  ) {
    const bannedUsers = await this.bannedUserModel
      .find(filter)
      .populate('userId', 'username fullName avatar')
      .skip(param.skip)
      .limit(param.take)
      .exec();
    const accounts = bannedUsers.map((user) => {
      return {
        userInfo: user.userId,
        bannedInfo: {
          numOfDaysBanned: user.numOfDaysBanned,
          bannedStartTime: user.bannedStartTime,
          bannedEndTime: user.bannedEndTime,
        },
      };
    });
    const totalPages = Math.ceil(accounts.length / param.take) || 0;
    return { totalPages, accounts };
  }
}
