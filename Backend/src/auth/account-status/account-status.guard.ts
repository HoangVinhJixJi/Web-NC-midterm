import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../modules/users/users.service';
import { BannedUsersService } from '../../modules/admin/management/account/banned-users/banned-users.service';

@Injectable()
export class AccountStatusGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly bannedUsersService: BannedUsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const user = await this.usersService.findOneById(userId);
    if (user.isActivated) {
      return true;
    } else {
      if (user.isBanned) {
        const bannedInfo = await this.bannedUsersService.getOneById(user._id);
        throw new HttpException(
          {
            bannedReason: bannedInfo.bannedReason,
            numOfDaysBanned: bannedInfo.numOfDaysBanned,
            bannedStartTime: bannedInfo.bannedStartTime,
            bannedEndTime: bannedInfo.bannedEndTime,
          },
          HttpStatus.FORBIDDEN,
        );
      } else {
        throw new HttpException(
          'Account has not been activated',
          HttpStatus.UNAUTHORIZED,
        );
      }
    }
  }
}
