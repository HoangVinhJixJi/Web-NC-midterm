import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('google_client_id'),
      clientSecret: configService.get<string>('google_client_secret'),
      callbackURL: `${configService.get<string>(
        'public_url',
      )}/auth/google-redirect`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      // Xử lý và trích xuất thông tin từ profile của Google
      const { id, name, emails, photos } = profile;
      const user = {
        googleId: id,
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
        accessToken,
        refreshToken,
      };

      // In thông tin người dùng vào console
      console.log('User google : ', user);

      done(null, user);
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error('Error validating Google user:', error);
      done(error, null); // Báo cho Passport biết rằng có lỗi xác thực
    }
  }
}
