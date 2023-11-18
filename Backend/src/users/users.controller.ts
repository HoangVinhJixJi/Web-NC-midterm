import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserInterface } from './interface/user.interface';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('register')
  async signUp(@Body() userData: CreateUserDto): Promise<UserInterface> {
    const { password, ...otherData } = userData;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return await this.usersService.create({
      password: hashedPassword,
      ...otherData,
    });
  }
}
