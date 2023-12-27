import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import mongoose, { Model } from 'mongoose';
import { BannedUser } from './schema/banned-user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;
const FOREVER_BAN_DAYS = 999999999999999;

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('BannedUser') private bannedUserModel: Model<BannedUser>,
    private usersService: UsersService,
  ) {}

  async getAccounts(
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
    searchTerm: string = '',
    status: string = '',
    action: string = '',
  ) {
    const skip = (page - 1) * pageSize;
    const filter = this.createFilterForGettingAccounts(
      searchTerm,
      status,
      action,
    );
    if (!filter) {
      return { totalPages: 0, accounts: [] };
    }
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
      } else {
        return { ...resUser, status };
      }
      return resUser;
    });
    return { totalPages: result.totalPages, accounts };
  }
  async banAccount(userId: string, reason: string, numOfDaysBanned: any) {
    const user = await this.usersService.updateUserByField(userId, {
      isActivated: false,
      isBanned: true,
    });
    if (user && !user.isActivated && user.isBanned) {
      console.log(user);
      const username = user.username;
      const bannedReason = reason;
      const currentTimes = new Date();
      const bannedDaysNumber =
        parseInt(numOfDaysBanned, 10) || FOREVER_BAN_DAYS;
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
        bannedReason,
        numOfDaysBanned,
        bannedStartTime: currentTimes,
        bannedEndTime: expiredBans,
      };
      const data = { $set: newBannedUser };
      return this.bannedUserModel.findOneAndUpdate({ userId: userId }, data, {
        new: true,
        upsert: true,
      });
    }
    throw new HttpException(
      'Account ban failed',
      HttpStatus.EXPECTATION_FAILED,
    );
  }
  async getBannedAccounts(
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
    searchTerm: string = '',
    totalDaysBanned: string = '',
  ) {
    const skip = (page - 1) * pageSize;
    const result = this.createFilterForGettingBannedAccounts(
      searchTerm,
      totalDaysBanned,
    );
    return await this.getBannedAccountListByPage(
      {
        skip,
        take: pageSize,
      },
      result.filter,
      result.match,
    );
  }
  private async getBannedAccountListByPage(
    param: { take: number; skip: number },
    filter: any = {},
    match: any = {},
  ) {
    const bannedUsers = await this.bannedUserModel
      .find(filter)
      .populate({
        path: 'userId',
        match: match,
        select: 'username fullName avatar',
      })
      .skip(param.skip)
      .limit(param.take)
      .exec();
    const accounts = bannedUsers
      .map((user) => {
        return {
          userInfo: user.userId,
          bannedInfo: {
            bannedReason: user.bannedReason,
            numOfDaysBanned: user.numOfDaysBanned,
            bannedStartTime: user.bannedStartTime,
            bannedEndTime: user.bannedEndTime,
          },
        };
      })
      .filter((user) => user.userInfo !== null);
    const totalPages = Math.ceil(accounts.length / param.take) || 0;
    return { totalPages, accounts };
  }
  async getPersonalInfo(username: string) {
    const user = await this.usersService.findOneByUsername(username);
    return user
      ? {
          avatar: user.avatar,
          fullName: user.fullName,
          email: user.email,
          birthday: user.birthday,
          gender: user.gender,
        }
      : {};
  }
  async getAccountInfo(username: string) {
    let responseData: any = {};
    const user = await this.usersService.findOneByUsername(username);
    responseData = {
      ...responseData,
      userId: user._id,
      username: user.username,
      fullName: user.fullName,
      avatar: user.avatar,
      status: user.isActivated
        ? 'Active'
        : user.isBanned
          ? 'Banned'
          : 'Pending',
    };
    if (responseData.status === 'Banned') {
      const bannedInfo = await this.bannedUserModel
        .findOne({ userId: user._id })
        .exec();
      responseData = {
        ...responseData,
        bannedReason: bannedInfo.bannedReason,
        numOfDaysBanned: bannedInfo.numOfDaysBanned,
        bannedStartTime: bannedInfo.bannedStartTime,
        bannedEndTime: bannedInfo.bannedEndTime,
      };
    }
    return responseData;
  }
  private isMatchStatusAndAction(status: string, action: string) {
    return (
      status === '' ||
      action === '' ||
      (status.toLowerCase() === 'active' && action.toLowerCase() === 'ban') ||
      (status.toLowerCase() === 'pending' &&
        action.toLowerCase() === 'active') ||
      (status.toLowerCase() === 'banned' &&
        (action.toLowerCase() === 'unban' || action.toLowerCase() === 'delete'))
    );
  }
  private createFilterForGettingAccounts(
    searchTerm: string,
    status: string,
    action: string,
  ) {
    let filter: any = [{ role: { $ne: 'admin' } }];
    if (searchTerm !== '') {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(searchTerm);
      filter = [
        ...filter,
        {
          $or: isValidObjectId
            ? [
                { _id: searchTerm },
                { fullName: { $regex: searchTerm, $options: 'i' } },
              ]
            : [{ fullName: { $regex: searchTerm, $options: 'i' } }],
        },
      ];
    }
    if (this.isMatchStatusAndAction(status, action)) {
      if (status !== '') {
        switch (status.toLowerCase()) {
          case 'active':
            return {
              $and: [...filter, { isActivated: true }],
            };
          case 'pending':
            return {
              $and: [...filter, { isActivated: false, isBanned: false }],
            };
          case 'banned':
            return {
              $and: [...filter, { isActivated: false, isBanned: true }],
            };
        }
      } else if (action !== '') {
        switch (action.toLowerCase()) {
          case 'active':
            return {
              $and: [...filter, { isActivated: false, isBanned: false }],
            };
          case 'ban':
            return { $and: [...filter, { isActivated: true }] };
          case 'unban':
          case 'delete':
            return {
              $and: [...filter, { isActivated: false, isBanned: true }],
            };
        }
      } else {
        return { $and: filter };
      }
    } else {
      return null;
    }
  }
  private createFilterForGettingBannedAccounts(
    searchTerm: string,
    totalDaysBanned: string,
  ) {
    let filter: any =
      totalDaysBanned !== ''
        ? [{ numOfDaysBanned: parseInt(totalDaysBanned) || FOREVER_BAN_DAYS }]
        : [];
    let match: any = {};
    if (searchTerm !== '') {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(searchTerm);
      if (isValidObjectId) filter = [...filter, { userId: searchTerm }];
      else match = { fullName: { $regex: searchTerm, $options: 'i' } };
    }
    return { filter: filter.length !== 0 ? { $and: filter } : {}, match };
  }
}
