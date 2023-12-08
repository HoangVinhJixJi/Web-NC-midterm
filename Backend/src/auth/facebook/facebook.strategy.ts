/* eslint-disable prettier/prettier */
// facebook.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-facebook';
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

  async validate(accessToken: string, refreshToken: string, profile: Profile): Promise<any> {
    const { id, displayName, photos, emails } = profile;
    console.log("Profile Facebook: ", profile);
    // const avatarUrl = `https://graph.facebook.com/${id}/picture?type=normal`;
    const avatarUrl = `https://graph.facebook.com/${id}/picture?width=200&height=200&access_token=${accessToken}`;
    console.log("avatarURL: ", avatarUrl);
    const user = {
      facebookId: id,
      fullName: displayName,
      avatar: photos ? avatarUrl : null ,
      email: emails ? emails[0].value : null,
    };
    console.log('user facebook : ', user);
    return user;
  }
}