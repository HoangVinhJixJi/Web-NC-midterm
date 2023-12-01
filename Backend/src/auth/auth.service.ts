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
    const resetPasswordToken = null;
    return await this.usersService.create({
      password: hashedPassword,
      isActivated: false,
      activationToken,
      resetPasswordToken,
      ...otherData,
    });
  }
  async activateAccount(token: string): Promise<string | null> {
    const user = await this.usersService.findByActivationToken(token);
    if (user) {
      user.isActivated = true;
      user.activationToken = null;
      await this.usersService.updateActivatedUser(user);
      return user.email;
    }
    return null;
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
  async sendWelcomeEmail(email: string) {
    const mailData = {
      subject: 'Chào mừng bạn đến với website của chúng tôi',
      to: email,
      template: 'welcome',
      context: {},
    };
    await this.mailService.sendEmail(mailData);
  }
  async forgotPassword(userEmail: string) {
    const user = await this.usersService.findOneByEmail(userEmail);
    if (user) {
      const payload = {
        sub: user._id.toString(),
        username: user.username,
      };
      return {
        username: user.username,
        user_email: user.email,
        reset_password_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
  }
  async sendForgotPasswordEmail(userInfo: {
    username: string;
    user_email: string;
    reset_password_token: string;
  }) {
    const resetPasswordLink = `${this.configService.get<string>(
      'app_url',
    )}/auth/reset-password/${userInfo.reset_password_token}`;
    const mailData = {
      subject: 'Đặt lại mật khẩu',
      to: userInfo.user_email,
      template: 'forgot-password',
      context: {
        username: userInfo.username,
        resetPasswordLink,
      },
    };
    await this.mailService.sendEmail(mailData);
  }
  async resetPassword(username: string, newPassword: string) {
    const newHashedPassword = await this.usersService.hashPassword(newPassword);
    const result = await this.usersService.findOneAndUpdate(username, {
      password: newHashedPassword,
    });
    return !!result;
  }
  async sendResetPasswordSuccessfullyMail(contextData: {
    clientIP: any;
    resetDateTime: string;
    userAgent: string;
    username: string;
  }) {
    const { email } = await this.usersService.findOneByUsername(
      contextData.username,
    );
    const mailData = {
      subject: 'Mật khẩu đã thay đổi',
      to: email,
      template: 'reset-password-successfully',
      context: {
        username: contextData.username,
        resetDateTime: contextData.resetDateTime,
        clientIP: contextData.clientIP,
        userAgent: contextData.userAgent,
      },
    };
    await this.mailService.sendEmail(mailData);
  }
  async extractToken(resetToken: string) {
    const jwt_secret = this.configService.get<string>('jwt.secret');
    try {
      return await this.jwtService.verifyAsync(resetToken, {
        secret: jwt_secret,
      });
    } catch {
      throw new HttpException(
        'Liên kết đã hết hiệu lực',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
