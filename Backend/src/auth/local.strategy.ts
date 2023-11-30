import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'Username',
      passwordField: 'Password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      const user = await this.authService.signIn(username, password);
      return user;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
