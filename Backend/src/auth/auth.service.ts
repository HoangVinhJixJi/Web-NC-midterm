import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/schema/user.schema';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}
  async signIn(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new HttpException('Username not found', HttpStatus.BAD_REQUEST);
    }
    if (!user.isActivated) {
      throw new HttpException(
        'Account has not been activated',
        HttpStatus.UNAUTHORIZED,
      );
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
    user['username'] = fbUser.facebookId;
    console.log('Facebook user after : ', user);
    return user;
  }
  //Sign In  Facebook
  async signInFacebook(user: any) {
    try {
      //Kiểm tra trong database có tài khoản trùng hay không?
      const existingUser = await this.usersService.findByFacebookIdOrEmail(
        user.facebookId,
        user.email,
      );
      console.log('user before : ', user);
      console.log('Đã tồn tại user Facebook: ', existingUser);
      if (!existingUser) {
        //Tạo mới 1 user
        const fbUser = this.handleUserFacebook(user);
        console.log('===> user Mới được thêm vào username:  ', fbUser);
        const newUser = await this.usersService.createFacebookUser(fbUser);
        console.log('new User Facebook: ', newUser);
        const payload = {
          sub: newUser['_id'].toString(),
          username: newUser['username'],
          email: newUser['email'],
        };
        console.log('payload(newUser) in sigInFacebook auth-service:', payload);
        return {
          userData: {
            fullName: newUser.fullName,
            avatar: newUser.avatar,
          },
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      // Nếu người dùng đã tồn tại, cập nhật thông tin (nếu có sự thay đổi) (avatar, name)
      if (existingUser.fullName !== user.fullName) {
        const updatedFields = {
          fullName: user.fullName,
          facebookId: user.facebookId,
        };
        console.log('user after update by fields: ');
        const updatedUser = await this.usersService.updateUserByField(
          existingUser['_id'].toString(),
          updatedFields,
        );
        console.log('user after update: ', updatedUser);
      }
      const curUser = await this.usersService.findByFacebookIdOrEmail(
        user.facebookId,
        user.email,
      );
      const payload = {
        sub: curUser['_id'].toString(),
        username: curUser['username'],
        email: curUser['email'],
      };
      //console.log('payload in sigInFacebook auth-service: ', payload);
      return {
        userData: {
          fullName: curUser.fullName,
          avatar: curUser.avatar,
        },
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error('Error when create user signinFacebook: ', error);
      return null;
    }
  }
  async signUp(userData: CreateUserDto) {
    const { password, ...otherData } = userData;
    const isExisted = await this.usersService.isExistedUser(
      otherData.username,
      otherData.email,
    );
    if (isExisted) {
      throw new HttpException(isExisted, HttpStatus.BAD_REQUEST);
    }
    const hashedPassword = await this.usersService.hashPassword(password);
    const activationToken = uuidv4();
    const resetPasswordToken = null;
    return await this.usersService.create({
      password: hashedPassword,
      isActivated: false,
      activationToken,
      resetPasswordToken,
      ...otherData,
    });
  }
  async activateAccount(token: string): Promise<string | null> {
    const user = await this.usersService.findByActivationToken(token);
    if (user) {
      user.isActivated = true;
      user.activationToken = null;
      await this.usersService.updateActivatedUser(user);
      return user.email;
    }
    return null;
  }
  async sendActivationEmail(newUser: User) {
    const activationLink = `${this.configService.get<string>(
      'public_url',
    )}/auth/active/${newUser.activationToken}`;
    const mailData = {
      subject: 'Kích hoạt tài khoản',
      to: newUser.email,
      template: 'activation',
      context: {
        username: newUser.username,
        activationLink,
      },
    };
    await this.mailService.sendEmail(mailData);
  }
  async sendWelcomeEmail(email: string) {
    const mailData = {
      subject: 'Chào mừng bạn đến với website của chúng tôi',
      to: email,
      template: 'welcome',
      context: {},
    };
    await this.mailService.sendEmail(mailData);
  }
  async forgotPassword(userEmail: string) {
    const user = await this.usersService.findOneByEmail(userEmail);
    if (user) {
      return await this.createResetPasswordData(user);
    } else {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
  }
  async createResetPasswordData(user: User) {
    const payload = {
      sub: user._id.toString(),
      username: user.username,
    };
    const reset_password_token = await this.jwtService.signAsync(payload);
    await this.usersService.findOneAndUpdate(payload.username, {
      resetPasswordToken: reset_password_token,
    });
    return {
      username: user.username,
      user_email: user.email,
      reset_password_token,
    };
  }
  async sendForgotPasswordEmail(userInfo: {
    username: string;
    user_email: string;
    reset_password_token: string;
  }) {
    const resetPasswordLink = `${this.configService.get<string>(
      'public_url',
    )}/auth/reset-password/${userInfo.reset_password_token}`;
    const mailData = {
      subject: 'Đặt lại mật khẩu',
      to: userInfo.user_email,
      template: 'forgot-password',
      context: {
        username: userInfo.username,
        resetPasswordLink,
      },
    };
    await this.mailService.sendEmail(mailData);
  }
  async resetPassword(username: string, newPassword: string) {
    const newHashedPassword = await this.usersService.hashPassword(newPassword);
    const result = await this.usersService.findOneAndUpdate(username, {
      password: newHashedPassword,
      resetPasswordToken: null,
    });
    return !!result;
  }
  async sendResetPasswordSuccessfullyMail(contextData: {
    os: any;
    resetDateTime: string;
    browser: any;
    clientIP: any;
    username: string;
  }) {
    const { email } = await this.usersService.findOneByUsername(
      contextData.username,
    );
    const mailData = {
      subject: 'Mật khẩu đã thay đổi',
      to: email,
      template: 'reset-password-successfully',
      context: {
        username: contextData.username,
        resetDateTime: contextData.resetDateTime,
        clientIP: contextData.clientIP,
        browser: contextData.browser,
        os: contextData.os,
      },
    };
    await this.mailService.sendEmail(mailData);
  }
  async extractToken(resetToken: string) {
    const user = await this.usersService.findByResetPasswordToken(resetToken);
    if (user) {
      const jwt_secret = this.configService.get<string>('jwt.secret');
      try {
        return await this.jwtService.verifyAsync(resetToken, {
          secret: jwt_secret,
        });
      } catch {
        return null;
      }
    } else {
      return null;
    }
  }
  async signInWithGoogle(req: any) {
    const user = req.user;
    const ggUser = {
      username: user.googleId,
      fullName: user.firstName + ' ' + user.lastName,
      avatar: user.picture,
      email: user.email,
    };
    const systemUser = await this.usersService.findOneByEmail(user.email);
    console.log('gguser: ', ggUser);
    console.log('systemUser: ', systemUser);
    if (!systemUser) {
      const newUser = await this.usersService.createUserFromGoogleUser(ggUser);
      const payload = {
        sub: newUser._id.toString(),
        username: newUser.username,
        email: newUser.email,
      };
      return {
        userData: {
          fullName: newUser.fullName,
          avatar: newUser.avatar,
        },
        access_token: this.jwtService.sign(payload, {
          secret: this.configService.get<string>('jwt.secret'),
        }),
        // access_token: this.jwtService.signAsync(payload),
      };
    }
    if (
      systemUser.fullName !== ggUser.fullName ||
      systemUser.avatar !== ggUser.avatar
    ) {
      const updatedUser = await this.usersService.updateUserByField(
        systemUser._id,
        {
          fullName: ggUser.fullName,
          avatar: ggUser.avatar,
        },
      );
      console.log('Updated User: ', updatedUser);
    }
    const curUser = await this.usersService.findOneByEmail(systemUser.email);
    const payload = {
      sub: curUser._id.toString(),
      username: curUser.username,
      email: curUser.email,
    };
    return {
      userData: {
        fullName: curUser.fullName,
        avatar: curUser.avatar,
      },
      access_token: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('jwt.secret'),
      }),
      // access_token: this.jwtService.signAsync(payload),
    };
  }
}
