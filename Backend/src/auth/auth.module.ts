import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsersModule } from '../modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local/local.strategy';
import { JwtStrategy } from './jwt/jwt.strategy';
import { GoogleStrategy } from './google/google.strategy';
import { FacebookStrategy } from './facebook/facebook.strategy';
import { PassportModule } from '@nestjs/passport';
import { EnrollmentsModule } from 'src/modules/enrollments/enrollments.module';
import { PendingInvitesModule } from 'src/modules/pendingInvites/pendingInvites.module';
import { BannedUsersModule } from '../modules/admin/management/account/banned-users/banned-users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'facebook' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: configService.get<string>('jwt.expiresIn'),
          },
        };
      },
    }),
    PassportModule,
    EnrollmentsModule,
    PendingInvitesModule,
    BannedUsersModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
