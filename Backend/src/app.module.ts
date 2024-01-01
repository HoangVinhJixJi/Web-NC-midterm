import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from './mail/mail.module';
import { EnrollmentsModule } from './modules/enrollments/enrollments.module';
import { ClassesModule } from './modules/classes/classes.module';
import { PendingInvitesModule } from './modules/pendingInvites/pendingInvites.module';
import { GradeStructuresModule } from './modules/gradeStructures/gradeStructures.module';

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
    PassportModule,
    MailModule,
    EnrollmentsModule,
    ClassesModule,
    PendingInvitesModule,
    GradeStructuresModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
