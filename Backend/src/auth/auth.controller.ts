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
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard'; // Thêm import JwtAuthGuard
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard) // Sử dụng LocalAuthGuard cho đăng nhập local
  @Post('login')
  signIn(@Body(new ValidationPipe({ transform: true })) signInData: SignInDto) {
    return this.authService.signIn(signInData.username, signInData.password);
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

  @UseGuards(JwtAuthGuard) // Sử dụng JwtAuthGuard cho các route cần xác thực JWT
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
