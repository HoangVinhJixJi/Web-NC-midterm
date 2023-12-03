import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
<<<<<<< HEAD
import { PassportModule } from '@nestjs/passport';
=======
import { MailModule } from './mail/mail.module';
>>>>>>> Backend

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      cache: true,
      expandVariables: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.db_connection_uri'),
      }),
    }),
    UsersModule,
    AuthModule,
<<<<<<< HEAD
    PassportModule,
=======
    MailModule,
>>>>>>> Backend
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
