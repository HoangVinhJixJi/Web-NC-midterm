import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '../auth/auth.guard';
import { UserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  async signUp(@Body() userData: CreateUserDto): Promise<UserDto> {
    const { password, ...otherData } = userData;
    // Kiểm tra có user theo username và email
    const isExisted = await this.usersService.isExistedUser(
      otherData.username,
      otherData.email,
    );
    if (isExisted) {
      throw new HttpException(isExisted, HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.hashPassword(password);
    const newUser = await this.usersService.create({
      password: hashedPassword,
      ...otherData,
      ...{ fullName: '', gender: '', birthday: '', avatar: '' },
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
    const { username, email } = req.user;
    if (username !== userData.username && email !== userData.email) {
      // Kiểm tra có user theo username và email
      const isExisted = await this.usersService.isExistedUser(
        userData.username,
        userData.email,
      );
      if (isExisted) {
        throw new HttpException(isExisted, HttpStatus.BAD_REQUEST);
      }
    } else if (username !== userData.username) {
      const existingUserByUsername = await this.usersService.findOneByUsername(
        userData.username,
      );
      if (existingUserByUsername) {
        throw new HttpException(
          'Username already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    } else if (email !== userData.email) {
      const existingUserByEmail = await this.usersService.findOneByEmail(
        userData.email,
      );
      if (existingUserByEmail) {
        throw new HttpException(
          'Email has been registered to another account',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
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
  @UseGuards(AuthGuard)
  @Post('update-password')
  async updatePassword(@Request() req, @Body() userData: UpdatePasswordDto) {
    const { username } = req.user;
    const user = await this.usersService.findOneByUsername(username);
    const { password } = user;
    const isMatch = await bcrypt.compare(userData.oldPassword, password);
    if (isMatch) {
      const newHashedPassword = await this.hashPassword(userData.newPassword);
      const updateRes = await this.usersService.updatePassword(
        username,
        newHashedPassword,
      );
      if (updateRes) {
        throw new HttpException('Update successfully', HttpStatus.OK);
      } else {
        throw new HttpException(
          'Update password failed',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    throw new HttpException('Invalid password', HttpStatus.OK);
  }
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
