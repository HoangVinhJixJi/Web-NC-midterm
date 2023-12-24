import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';

@Injectable()
export class AccountService {
  constructor(private usersService: UsersService) {}

  async getAccounts(page: number = 1, pageSize: number = 8) {
    const skip = (page - 1) * pageSize;
    const result = await this.usersService.getUserListByPage({
      skip,
      take: pageSize,
    });
    const accounts = result.users.map((user) => {
      return {
        userId: user._id,
        username: user.username,
        fullName: user.fullName,
        avatar: user.avatar,
        status: user.isActivated ? 'Active' : 'Pending',
      };
    });
    return { totalPages: result.totalPages, accounts };
  }
}
