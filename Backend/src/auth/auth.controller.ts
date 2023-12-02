import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Param,
  Post,
  Render,
  Req,
  Request,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as useragent from 'express-useragent';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(
    @Body(new ValidationPipe({ transform: true })) userData: CreateUserDto,
  ): Promise<string> {
    const newUser = await this.authService.signUp(userData);
    await this.authService.sendActivationEmail(newUser);
    return 'Đăng ký thành công. Vui lòng kiểm tra email để kích hoạt tài khoản.';
  }
  @Get('active/:token')
  @Render('activate')
  async activateAccount(@Param('token') token: string) {
    const user_email = await this.authService.activateAccount(token);
    if (user_email) {
      await this.authService.sendWelcomeEmail(user_email);
      return {
        state: 'Successfully',
        message: 'Your account has been successfully activated',
      };
    } else {
      return {
        state: 'Error',
        message: 'Account activation error',
      };
    }
  }
  @Post('forgot-password')
  async forgotPassword(
    @Body(new ValidationPipe({ transform: true })) userData: ForgotPasswordDto,
  ) {
    const userInfo = await this.authService.forgotPassword(userData.userEmail);
    await this.authService.sendForgotPasswordEmail(userInfo);
    return userInfo;
  }
  @Get('reset-password/:resetToken')
  async goToResetPasswordPage(
    @Param('resetToken') resetToken: string,
    @Res() res: any,
  ) {
    const userInfo = await this.authService.extractToken(resetToken);
    if (userInfo) {
      res.render('reset-password', { username: userInfo.username });
    } else {
      res.render('reset-password-expired');
    }
  }
  @Post('reset-password/:username')
  async resetPassword(
    @Body(new ValidationPipe({ transform: true })) userData: ResetPasswordDto,
    @Param('username') username: string,
    @Req() req: Request,
    @Ip() ip: any,
  ) {
    const result = await this.authService.resetPassword(
      username,
      userData.newPassword,
    );
    if (result) {
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
      };
      const dateTime = new Date().toLocaleString('vi-VN', options);
      const { browser, os } = JSON.parse(
        JSON.stringify(useragent.parse(req.headers['user-agent'])),
      );
      const contextData = {
        username,
        resetDateTime: dateTime,
        browser,
        os,
        clientIP: ip,
      };
      await this.authService.sendResetPasswordSuccessfullyMail(contextData);
      return {
        status: 'Successfully',
        message: 'Reset password successfully',
      };
    }
    return {
      status: 'Error',
      message: 'Reset password fail',
    };
  }
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(new ValidationPipe({ transform: true })) signInData: SignInDto) {
    return this.authService.signIn(signInData.username, signInData.password);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserDto> {
    const { username } = req.user;
    const user = await this.usersService.findOneByUsername(username);
    return {
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      gender: user.gender,
      birthday: user.birthday,
      avatar: user.avatar,
    };
  }
}
