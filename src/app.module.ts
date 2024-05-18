import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { EventsModule } from './events/events.module.js';
import { FtApiModule } from './ft-api/ft-api.module.js';
import { ConfigModule } from '@nestjs/config';
import { ftApiConfig } from './common/config/ft-api.js';
import { TasksModule } from './tasks/tasks.module.js';
import { ScheduleModule } from '@nestjs/schedule';
import { FtModule } from './ft/ft.module.js';

@Module({
  imports: [
    EventsModule,
    FtApiModule,
    ConfigModule.forRoot({
      load: [ftApiConfig],
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    FtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
