import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string): Promise<any> {
    try {
      console.log(`Attempting to validate user: ${username}`);
      const user = await this.authService.signIn(username, password);
      console.log(`User ${username} successfully validated.`);
      return user;
    } catch (error) {
      console.error(`Error validating user ${username}: ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }
}
