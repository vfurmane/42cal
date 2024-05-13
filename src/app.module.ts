import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { FtApiModule } from './ft-api/ft-api.module';
import { ConfigModule } from '@nestjs/config';
import { ftApiConfig } from './common/config/ft-api';

@Module({
  imports: [
    EventsModule,
    FtApiModule,
    ConfigModule.forRoot({
      load: [ftApiConfig],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
