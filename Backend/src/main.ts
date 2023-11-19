import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const configService = app.get(ConfigService);
  await app.listen(configService.get<number>('port'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
