import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDto } from './dto/user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  async signUp(@Body() userData: CreateUserDto): Promise<UserDto> {
    const { password, ...otherData } = userData;
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.usersService.create({
      password: hashedPassword,
      ...otherData,
    });
    return {
      userId: newUser.userId,
      username: newUser.username,
      email: newUser.email,
      fullName: newUser.fullName,
      gender: newUser.gender,
      birthday: newUser.birthday,
      avatar: newUser.avatar,
    };
  }
  @UseGuards(AuthGuard)
  @Post('update')
  async updateProfile(
    @Request() req,
    @Body() userData: UpdateUserDto,
  ): Promise<UserDto> {
    const { username } = req.user;
    const updatedUser = await this.usersService.findOneAndUpdate(
      username,
      userData,
    );
    return {
      userId: updatedUser.userId,
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
      avatar: updatedUser.avatar,
    };
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
