import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { UserInterface } from '../users/interface/user.interface';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInData: SignInDto) {
    return this.authService.signIn(signInData.username, signInData.password);
  }
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Request() req): Promise<UserInterface> {
    const { username } = req.user;
    return await this.usersService.findOne(username);
  }
}
