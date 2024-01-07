import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import mongoose, { Model } from 'mongoose';
import { BannedUser } from './schema/banned-user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import { ClassesService } from '../../../classes/classes.service';
import { SortOrderEnum } from '../../../../enums/sort-order.enum';
import { AccountStatusEnum } from '../../../../enums/account-status.enum';
import { AccountActionEnum } from '../../../../enums/account-action.enum';
import { AssignAccountStudentIdDto } from './dto/assign-account-student-id.dto';

const PAGE_NUMBER_DEFAULT: number = 1;
const PAGE_SIZE_NUMBER_DEFAULT: number = 8;
const FOREVER_BAN_DAYS = 999999999999999;

@Injectable()
export class AccountService {
  constructor(
    @InjectModel('BannedUser') private bannedUserModel: Model<BannedUser>,
    private usersService: UsersService,
    private classesService: ClassesService,
  ) {}

  async getAccounts(
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
    searchTerm: string = '',
    status: string = '',
    action: string = '',
    sortedBy: string = 'userId',
    sortOrder: string = SortOrderEnum.Increase,
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
      { skip, take: pageSize },
      filter,
      { sortedBy, sortOrder },
    );
    const accounts = result.users.map((user) => {
      let resUser: any = {
        userId: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        studentId: user.studentId,
      };
      if (status === '') {
        resUser = {
          ...resUser,
          status: user.isActivated
            ? AccountStatusEnum.Active
            : user.isBanned
              ? AccountStatusEnum.Banned
              : AccountStatusEnum.Pending,
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
  async unbanAccount(userId: string) {
    const unbanUser = await this.bannedUserModel.findOneAndDelete({
      userId: userId,
    });
    if (unbanUser) {
      return this.usersService.updateUserByField(userId, {
        isActivated: true,
        isBanned: false,
      });
    }
    return null;
  }
  async getBannedAccounts(
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
    searchTerm: string = '',
    totalDaysBanned: string = '',
    sortedBy: string = 'userId',
    sortOrder: string = SortOrderEnum.Increase,
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
      { sortedBy, sortOrder },
    );
  }
  private async getBannedAccountListByPage(
    param: { take: number; skip: number },
    filter: any = {},
    match: any = {},
    sort: { sortedBy: string; sortOrder: string },
  ) {
    const total = await this.bannedUserModel.countDocuments(filter);
    if (total === 0 || param.skip >= total) {
      return { totalPages: total, accounts: [] };
    }
    const totalPages = Math.ceil(total / param.take);
    let sortCondition: any = {};
    switch (sort.sortedBy.toLowerCase()) {
      case 'userid':
        sortCondition = {
          ...sortCondition,
          userId:
            sort.sortOrder.toLowerCase() === SortOrderEnum.Increase ? 1 : -1,
        };
        break;
      case 'numofdaysbanned':
        sortCondition = {
          ...sortCondition,
          numOfDaysBanned:
            sort.sortOrder.toLowerCase() === SortOrderEnum.Increase ? 1 : -1,
        };
        break;
      case 'fullname':
        break;
      default:
        sortCondition = { ...sortCondition, userId: 1 };
    }
    console.log(sortCondition);
    if (Object.keys(sortCondition).length !== 0) {
      const bannedUsers = await this.bannedUserModel
        .find(filter)
        .sort(sortCondition)
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
      return { totalPages, accounts };
    } else {
      const bannedUsers = await this.bannedUserModel
        .find(filter)
        .populate({
          path: 'userId',
          match: match,
          select: 'username fullName avatar',
        })
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
      const sortedAccounts = accounts.sort((a, b) => {
        const userInfoObjA: any = a.userInfo;
        const userInfoObjB: any = b.userInfo;
        const lastNameA = userInfoObjA.fullName.split(' ').pop().toLowerCase();
        const lastNameB = userInfoObjB.fullName.split(' ').pop().toLowerCase();
        return sort.sortOrder.toLowerCase() === SortOrderEnum.Increase
          ? lastNameA.localeCompare(lastNameB)
          : lastNameB.localeCompare(lastNameA);
      });
      return {
        totalPages,
        accounts: sortedAccounts.slice(param.skip, param.skip + param.take),
      };
    }
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
      (status.toLowerCase() === AccountStatusEnum.Active &&
        action.toLowerCase() === AccountActionEnum.BAN) ||
      (status.toLowerCase() === AccountStatusEnum.Pending &&
        action.toLowerCase() === AccountActionEnum.ACTIVE) ||
      (status.toLowerCase() === AccountStatusEnum.Banned &&
        (action.toLowerCase() === AccountActionEnum.UNBAN ||
          action.toLowerCase() === AccountActionEnum.DELETE))
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
          case AccountStatusEnum.Active:
            return {
              $and: [...filter, { isActivated: true }],
            };
          case AccountStatusEnum.Pending:
            return {
              $and: [...filter, { isActivated: false, isBanned: false }],
            };
          case AccountStatusEnum.Banned:
            return {
              $and: [...filter, { isActivated: false, isBanned: true }],
            };
        }
      } else if (action !== '') {
        switch (action.toLowerCase()) {
          case AccountActionEnum.ACTIVE:
            return {
              $and: [...filter, { isActivated: false, isBanned: false }],
            };
          case AccountActionEnum.BAN:
            return { $and: [...filter, { isActivated: true }] };
          case AccountActionEnum.UNBAN:
          case AccountActionEnum.DELETE:
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
  async getUserClasses(
    username: any,
    classType: string,
    searchTerm: string = '',
    page: number = PAGE_NUMBER_DEFAULT,
    pageSize: number = PAGE_SIZE_NUMBER_DEFAULT,
  ) {
    const role = classType.toLowerCase() === 'teaching' ? 'teacher' : 'student';
    const user = await this.usersService.findOneByUsername(username);
    if (user) {
      const classes = await this.classesService.getUserClassesForAdmin(
        user._id,
        role,
        '',
        searchTerm,
      );
      const totalPages = Math.ceil(classes.length / pageSize);
      if (page > totalPages) {
        return { totalPages, classes: [] };
      }
      const skip = (page - 1) * pageSize;
      const end =
        skip + pageSize > classes.length ? classes.length : skip + pageSize;
      return { totalPages, classes: classes.slice(skip, end) };
    }
    return null;
  }
  async assignStudentId(userId: string, studentId: string) {
    return this.usersService.adminAssignStudentId(userId, studentId);
  }
  async assignStudentIds(userData: Array<AssignAccountStudentIdDto>) {
    return this.usersService.adminAssignStudentIds(userData);
  }
}