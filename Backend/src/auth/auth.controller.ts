import {
  Body,
  Controller,
  Get,
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
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local/local-auth.guard';
import { JwtAuthGuard } from './jwt/jwt-auth.guard'; // Thêm import JwtAuthGuard
import { GoogleOAuthGuard } from './google/google-oauth.guard';
import { UsersService } from '../modules/users/users.service';
import { UserDto } from '../modules/users/dto/user.dto';
import { FacebookAuthGuard } from './facebook/facebook-auth.guard';
import { CreateUserDto } from '../modules/users/dto/create-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import * as useragent from 'express-useragent';
import { ConfigService } from '@nestjs/config';
import { PendingInvitesService } from 'src/modules/pendingInvites/pendingInvites.service';
import { EnrollmentsService } from 'src/modules/enrollments/enrollments.service';
import { Role } from '../enums/role.enum';
import { LoginByRoleGuard } from './roles/login-by-role.guard';
import { Roles } from './roles/roles.decorator';
import { AccountStatusGuard } from './account-status/account-status.guard';
import { RolesGuard } from './roles/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly pendingInvitesService: PendingInvitesService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  @Post('register')
  async signUp(
    @Body(new ValidationPipe({ transform: true })) userData: CreateUserDto,
  ): Promise<string> {
    const newUser = await this.authService.signUp(userData);
    await this.authService.sendActivationEmail(newUser);
    return 'Sign Up Success. Please check your email to activate your account.';
  }
  @Post('register/:pendingInviteId')
  async signUpAndJoinClass(
    @Body(new ValidationPipe({ transform: true })) userData: CreateUserDto,
    @Param('pendingInviteId') pendingInviteId: string,
  ): Promise<string> {
    const newUser = await this.authService.signUp(userData);
    await this.authService.sendActivationEmail(newUser);
    const pendingInvite =
      await this.pendingInvitesService.findOneById(pendingInviteId);
    if (pendingInvite.email === userData.email) {
      const enrollment = await this.enrollmentsService.add(
        pendingInvite.classId.toString(),
        newUser._id,
        pendingInvite.role,
        false,
      );
      const deletePendingInvite = await this.pendingInvitesService.delete(
        pendingInvite.classId.toString(),
        pendingInvite.email,
        pendingInvite.role,
      );
      console.log(enrollment);
      console.log(deletePendingInvite);
    }
    return 'Sign Up Success. Please check your email to activate your account.';
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
  @Post('activate/resend-mail')
  async resendActivationEmail(
    @Body(new ValidationPipe({ transform: true }))
    userData: Record<string, any>,
  ) {
    const user = await this.usersService.findOneByEmail(userData.email);
    if (user.activationToken) {
      await this.authService.sendActivationEmail(user);
      return 'The mail has been sent back to you, please check your email and activate your account.';
    } else {
      return 'No request to activate your account or your account is already activated.';
    }
  }
  @Post('forgot-password')
  async forgotPassword(
    @Body(new ValidationPipe({ transform: true })) userData: ForgotPasswordDto,
  ) {
    const userInfo = await this.authService.forgotPassword(userData.userEmail);
    await this.authService.sendForgotPasswordEmail(userInfo);
    return userInfo.username;
  }
  @Post('forgot-password/resend-mail')
  async resendForgotPasswordEmail(
    @Body(new ValidationPipe({ transform: true }))
    userData: Record<string, any>,
  ) {
    const user = await this.usersService.findOneByEmail(userData.email);
    let userInfo: {
      user_email: string;
      reset_password_token: string;
      username: string;
    };
    // Nếu token còn trong DB, thì thực hiện kiểm tra hạn của token
    if (user.resetPasswordToken) {
      const userPayload = await this.authService.extractToken(
        user.resetPasswordToken,
      );
      // Nếu token còn hạn, thì gửi mail với link được tạo từ token trong DB
      if (userPayload) {
        userInfo = {
          username: user.username,
          user_email: userData.email,
          reset_password_token: user.resetPasswordToken,
        };
      }
      // Nếu token hết hạn, thì tạo token mới và gửi lại
      else {
        userInfo = await this.authService.createResetPasswordData(user);
      }
    }
    // Nếu user đã reset password và muốn gửi lại link, thì tạo link mới và gửi lại
    else {
      userInfo = await this.authService.createResetPasswordData(user);
    }
    await this.authService.sendForgotPasswordEmail(userInfo);
    return user.username;
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

  @UseGuards(LocalAuthGuard, LoginByRoleGuard)
  @Roles(Role.User)
  @Post('login')
  signIn(@Request() req: any) {
    return req.user;
    //return this.authService.respondSignIn(req.user, role);
  }
  @UseGuards(LocalAuthGuard, LoginByRoleGuard)
  @Roles(Role.Admin)
  @Post('admin-login')
  adminSignIn(@Request() req: any) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard) // Sử dụng JwtAuthGuard cho các route cần xác thực JWT
  @Get('login')
  getLoginPage(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard) // Sử dụng JwtAuthGuard cho các route cần xác thực JWT
  @Get('register')
  getRegisterPage(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard, AccountStatusGuard, RolesGuard) // Sử dụng JwtAuthGuard cho các route cần xác thực JWT
  @Roles(Role.User, Role.Admin)
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
      studentId: user.studentId,
    };
  }

  //facebook
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookLogin() {
    console.log('Facebook Passport strategy will handle the login.');
  }
  //facebook/callback
  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  async facebookLoginCallback(@Request() req, @Res() res) {
    console.log('Handles the Facebook OAuth callback', req.user);
    // Xử lý đăng nhập và lấy token
    const token = await this.authService.signInFacebook(req.user);
    //console.log('token: ', token);
    // Tạo URL chứa token và redirect_url
    const redirectUrl = `${this.configService.get<string>(
      'client_url',
    )}/signin`;
    const redirectWithToken = `${redirectUrl}?token=${token['access_token']}`;
    // Chuyển hướng người dùng đến URL mới
    res.redirect(redirectWithToken);
  }

  //test facebook create User
  @Post('/test/fb')
  testFacebookLogin(@Body() user: any) {
    console.log('Handles the Facebook OAuth callback', user);
    return this.authService.signInFacebook(user);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {}

  // @Get('google-redirect')
  // @UseGuards(GoogleOAuthGuard)
  // async googleAuthRedirect(@Request() req) {
  //   return this.authService.signInWithGoogle(req);
  // }
  @Get('google-redirect')
  @UseGuards(GoogleOAuthGuard)
  async googleAuthRedirect(@Request() req, @Res() res) {
    const token = await this.authService.signInWithGoogle(req);
    const redirectUrl = `${this.configService.get<string>(
      'client_url',
    )}/signin`;
    const redirectWithToken = `${redirectUrl}?token=${token.access_token}`;
    res.redirect(redirectWithToken);
  }
}
