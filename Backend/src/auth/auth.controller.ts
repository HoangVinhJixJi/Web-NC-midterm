import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { CreateUserDto } from '../users/dto/create-user.dto';

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
  async activateAccount(@Param('token') token: string): Promise<string> {
    const result = await this.authService.activateAccount(token);
    return result
      ? 'Tài khoản đã được kích hoạt'
      : 'Kích hoạt tài khoản không thành công';
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
