import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { FtCalSwaggerModule } from './ft-cal-swagger/ft-cal-swagger.module.js';

async function bootstrap() {
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
