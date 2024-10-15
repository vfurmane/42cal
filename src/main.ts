import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { FtCalSwaggerModule } from './ft-cal-swagger/ft-cal-swagger.module.js';
import { otelSDK } from './tracing/index.js';

async function bootstrap() {
  otelSDK.start();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  FtCalSwaggerModule.setup(app);
  await app.listen(3000);
}
bootstrap();
