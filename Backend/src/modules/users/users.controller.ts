import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../../auth/jwt/jwt-auth.guard';
import { UserDto } from './dto/user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Post('update')
  async updateProfile(
    @Request() req,
    @Body() userData: UpdateUserDto,
  ): Promise<UserDto> {
    const { username, email } = req.user;
    console.log('user from frontend: ', userData);
    console.log('user from AuthGaurd: ', req.user);
    if (username !== userData.username && email !== userData.email) {
      // Kiểm tra có user theo username và email
      const isExisted = await this.usersService.isExistedUser(
        userData.username,
        userData.email,
      );
      if (isExisted) {
        console.log('User already exists');
        throw new HttpException(isExisted, HttpStatus.BAD_REQUEST);
      }
    } else if (username !== userData.username) {
      const existingUserByUsername = await this.usersService.findOneByUsername(
        userData.username,
      );
      if (existingUserByUsername) {
        console.log('Username already exists');
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
        console.log('email already exists');
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
    console.log('updateUser: ', updatedUser);
    return {
      userId: updatedUser._id.toString(),
      username: updatedUser.username,
      email: updatedUser.email,
      fullName: updatedUser.fullName,
      gender: updatedUser.gender,
      birthday: updatedUser.birthday,
      avatar: updatedUser.avatar,
    };
  }
  @UseGuards(JwtAuthGuard)
  @Post('update-password')
  async updatePassword(
    @Request() req,
    @Body(new ValidationPipe({ transform: true })) userData: UpdatePasswordDto,
  ) {
    const { username } = req.user;
    const user = await this.usersService.findOneByUsername(username);
    const { password } = user;
    const isMatch = await bcrypt.compare(userData.oldPassword, password);
    if (isMatch) {
      const newHashedPassword = await this.usersService.hashPassword(
        userData.newPassword,
      );
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
    throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST);
  }
}
