import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';
import { FacebookAuthGuard } from './facebook-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body(new ValidationPipe({ transform: true })) signInData: SignInDto) {
    return this.authService.signIn(signInData.username, signInData.password);
  }
  @UseGuards(AuthGuard)
  @Get('login')
  getLoginPage(@Request() req) {
    return req.user;
  }
  @UseGuards(AuthGuard)
  @Get('register')
  getRegisterPage(@Request() req) {
    return req.user;
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

  //facebook
  @Get('facebook')
  @UseGuards(FacebookAuthGuard)
  async facebookLogin() {
    console.log('Facebook Passport strategy will handle the login.');
  }
  @Get('facebook/callback')
  @UseGuards(FacebookAuthGuard)
  facebookLoginCallback(@Request() req) {
    console.log('Handles the Facebook OAuth callback', req.user);
    return this.authService.signInFacebook(req.user);
  }
}
