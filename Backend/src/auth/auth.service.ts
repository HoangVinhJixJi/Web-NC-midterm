import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async signIn(username, pass) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new HttpException('Username not found', HttpStatus.BAD_REQUEST);
    }
    const { password } = user;
    const isMatch = await bcrypt.compare(pass, password);
    if (isMatch) {
      const payload = {
        sub: user._id.toString(),
        username: user.username,
        email: user.email,
      };
      return {
        userData: {
          fullName: user.fullName,
          avatar: user.avatar,
        },
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
  }
  async signInWithGoogle(req: any) {
    const user = req.user;
    const ggUser = {
      username: user.googleId,
      fullName: user.firstName + ' ' + user.lastName,
      avatar: user.picture,
      email: user.email,
    };
    const systemUser = await this.usersService.findOneByEmail(user.email);
    console.log('gguser: ', ggUser);
    console.log('systemUser: ', systemUser);
    if (!systemUser) {
      const newUser = await this.usersService.createUserFromGoogleUser(ggUser);
      const payload = {
        sub: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      };
      return {
        userData: {
          fullName: newUser.fullName,
          avatar: newUser.avatar,
        },
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('jwt_secret'),
        }),
      };
    }
    if (
      systemUser.fullName !== ggUser.fullName ||
      systemUser.avatar !== ggUser.avatar
    ) {
      const updatedUser = await this.usersService.updateUserByField(
        systemUser._id,
        {
          fullName: ggUser.fullName,
          avatar: ggUser.avatar,
        },
      );
      console.log('Updated User: ', updatedUser);
    }
    const curUser = await this.usersService.findOneByEmail(systemUser.email);
    const payload = {
      sub: curUser._id.toString(),
      username: curUser.username,
      email: curUser.email,
    };
    return {
      userData: {
        fullName: curUser.fullName,
        avatar: curUser.avatar,
      },
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt_secret'),
      }),
    };
  }
}
