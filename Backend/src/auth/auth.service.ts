import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}
  async signIn(username: string, pass: string) {
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
  async signUp(userData: CreateUserDto) {
    const { password, ...otherData } = userData;
    const isExisted = await this.usersService.isExistedUser(
      otherData.username,
      otherData.email,
    );
    if (isExisted) {
      throw new HttpException(isExisted, HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.usersService.hashPassword(password);
    const activationToken = uuidv4();
    return await this.usersService.create({
      password: hashedPassword,
      isActivated: false,
      activationToken: activationToken,
      ...otherData,
    });
  }
  async activateAccount(token: string): Promise<boolean> {
    const user = await this.usersService.findByActivationToken(token);
    if (user) {
      user.isActivated = true;
      user.activationToken = null;
      await this.usersService.updateActivatedUser(user);
      return true;
    }
    return false;
  }
  async sendActivationEmail(newUser: User) {
    const activationLink = `${this.configService.get<string>(
      'app_url',
    )}/auth/active/${newUser.activationToken}`;
    const mailData = {
      subject: 'Kích hoạt tài khoản',
      to: newUser.email,
      template: 'activation',
      context: {
        username: newUser.username,
        activationLink,
      },
    };
    await this.mailService.sendEmail(mailData);
  }
}
