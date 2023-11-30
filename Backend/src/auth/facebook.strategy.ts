/* eslint-disable prettier/prettier */
// facebook.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(Strategy, 'facebook') {
  constructor() {
    super({
      clientID: process.env.FB_CLIENT_ID,
      clientSecret: process.env.FB_CLIENT_SECRET,
      callbackURL: `${process.env.PUBLIC_URL}/auth/facebook/callback`,
      profileFields: ['id', 'displayName','photos', 'emails'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any): Promise<any> {
    const { id, displayName, photos, emails } = profile;
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