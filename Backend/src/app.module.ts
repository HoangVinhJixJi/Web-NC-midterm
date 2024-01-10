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
import { AssignmentsModule } from './modules/assignments/assignments.module';
import { GradesModule } from './modules/grades/grades.module';
<<<<<<< HEAD
import { NotificationsModule } from './modules/notifications/notifications.module';
import { EventsModule } from './gateway/events.module';
=======
import { AccountModule } from './modules/admin/management/account/account.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BannedUsersModule } from './modules/admin/management/account/banned-users/banned-users.module';
import { ClassModule } from './modules/admin/management/class/class.module';
>>>>>>> dca31a6edfb7b6feb4081e149da8cb7cfd522ae8

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
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    PassportModule,
    MailModule,
    EnrollmentsModule,
    ClassesModule,
    PendingInvitesModule,
    AssignmentsModule,
    GradesModule,
<<<<<<< HEAD
    NotificationsModule,
    EventsModule,
=======
    AccountModule,
    BannedUsersModule,
    ClassModule,
>>>>>>> dca31a6edfb7b6feb4081e149da8cb7cfd522ae8
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {}
