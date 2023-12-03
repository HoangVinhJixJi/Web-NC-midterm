/* eslint-disable prettier/prettier */
// facebook.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor(private configService: ConfigService) {
    super({
      clientID: configService.get<string>('fb_client_id'),
      clientSecret: configService.get<string>('fb_client_secret'),
      callbackURL: `${configService.get<string>('public_url')}/auth/facebook/callback`,
      profileFields: ['id', 'displayName','photos', 'emails'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const { id, displayName, photos, emails} = profile;
    // const avatarUrl = `https://graph.facebook.com//${id}/picture?type=normal`;
    // console.log("avatarURL: ", avatarUrl);
    const user = {
      facebookId: id,
      fullName: displayName,
      avatar: photos ? photos[0].value : null ,
      email: emails ? emails[0].value : null,
    };
    console.log('user facebook : ', user);
    return user;
  }
}