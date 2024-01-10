import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Role } from '../../enums/role.enum';
import { ROLES_KEY } from './roles.decorator';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../modules/users/users.service';
import { BannedUsersService } from '../../modules/admin/management/account/banned-users/banned-users.service';

@Injectable()
export class LoginByRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly bannedUsersService: BannedUsersService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log(requiredRoles);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user.userData;
    console.log(user);
    const canLogin = requiredRoles.some((role) => user.role?.includes(role));
    if (canLogin) {
      const userInfo = await this.usersService.findOneByUsername(user.username);
      if (!userInfo.isActivated) {
        if (!userInfo.isBanned) {
          throw new HttpException(
            'Account has not been activated',
            HttpStatus.UNAUTHORIZED,
          );
        } else {
          const bannedInfo = await this.bannedUsersService.getOneById(
            userInfo._id,
          );
          throw new HttpException(
            {
              bannedReason: bannedInfo.bannedReason,
              numOfDaysBanned: bannedInfo.numOfDaysBanned,
              bannedStartTime: bannedInfo.bannedStartTime,
              bannedEndTime: bannedInfo.bannedEndTime,
            },
            HttpStatus.FORBIDDEN,
          );
        }
      } else {
        return true;
      }
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
