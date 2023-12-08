import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<any> {
    try {
      console.log('Attempting to validate JWT token:', payload);

      // Check if payload is an object and convert it to a string
      if (typeof payload === 'object') {
        payload = JSON.stringify(payload);
      }
      const encodedPayload = jwt.sign(
        payload,
        this.configService.get<string>('JWT_SECRET'),
      );

      console.log('Type of payload:', typeof encodedPayload);
      const isValidToken = await this.jwtService.verifyAsync(encodedPayload);

      if (!isValidToken) {
        console.error('JWT validation failed: Invalid token');
        throw new UnauthorizedException('Invalid token');
      }

      console.log('JWT token validated successfully.');
      return isValidToken; // Return the entire payload from the token
    } catch (error) {
      console.error('Error validating JWT token:', error.message);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
