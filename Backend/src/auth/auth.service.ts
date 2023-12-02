import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(username, pass) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new HttpException('Username not found', HttpStatus.BAD_REQUEST);
    }
    const { password } = user;
    const isMatch = await bcrypt.compare(pass, password);
    if (isMatch) {
      const payload = {
        sub: user._id.toString(),
        username: user.username,
        email: user.email,
      };
      return {
        userData: {
          fullName: user.fullName,
          avatar: user.avatar,
        },
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }
  }
  //Handle profile user Facebook
  handleUserFacebook(fbUser: any) {
    console.log('Facebook user: ', fbUser);
    const user = fbUser;
    user['username'] = fbUser.fullName;
    console.log('Facebook user after : ', user);
    return user;
  }
  //Sign In  Facebook
  async signInFacebook(user: any) {
    //Kiểm tra trong database có tài khoản trùng hay không?
    const existingUser = await this.usersService.findByFacebookIdOrEmail(
      user.facebookId,
      user.email,
    );
    if (!existingUser) {
      //Tạo mới 1 user
      console.log('tạo mới 1 user: ', user);
      const fbUser = this.handleUserFacebook(user);
      console.log('===> user được thêm vào username:  ', fbUser);
      const newUser = await this.usersService.createFacebookUser(fbUser);
      console.log('new User Facebook: ', newUser);
      const payload = {
        sub: newUser['_id'].toString(),
        username: newUser['username'],
        email: newUser['email'],
      };
      console.log('payload(newUser) in sigInFacebook auth-service: ', payload);
      return {
        userData: {
          fullName: newUser.fullName,
          avatar: newUser.avatar,
        },
        access_token: await this.jwtService.signAsync(payload),
      };
    }
    console.log('Đã tồn tại user Facebook: ', existingUser);
    // Nếu người dùng đã tồn tại, cập nhật thông tin (nếu có sự thay đổi) (avatar, name)
    if (existingUser.fullName !== user.fullName) {
      const updatedFields = {
        fullName: user.fullName,
      };
      console.log('user after update by fields: ');
      const updatedUser = await this.usersService.updateUserByField(
        existingUser['_id'].toString(),
        updatedFields,
      );
      console.log('user after update: ', updatedUser);
    }
    const curUser = await this.usersService.findByFacebookIdOrEmail(
      existingUser['facebookId'],
      existingUser['email'],
    );
    const payload = {
      sub: curUser['_id'].toString(),
      username: curUser['username'],
      email: curUser['email'],
    };
    console.log('payload in sigInFacebook auth-service: ', payload);
    return {
      userData: {
        fullName: curUser.fullName,
        avatar: curUser.avatar,
      },
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
