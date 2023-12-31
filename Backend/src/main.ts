import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as hbs from 'hbs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'public'));
  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');
  const configService = app.get(ConfigService);
  hbs.registerHelper('eq', (a, b) => a === b);
  app.enableCors({
    origin: '*', // hoặc đặt origin của trang web của bạn
    credentials: true, // Cho phép sử dụng thông tin xác thực (cookies, headers...)
  });
  await app.listen(configService.get<number>('port'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
