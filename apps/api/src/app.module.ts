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
import { PQueueModule } from './p-queue/p-queue.module.js';
import { FtHourlyRateLimitModule } from './ft-hourly-rate-limit/ft-hourly-rate-limit.module.js';
import { FtSecondlyRateLimitModule } from './ft-secondly-rate-limit/ft-secondly-rate-limit.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { FtCalSwaggerModule } from './ft-cal-swagger/ft-cal-swagger.module.js';

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
    PQueueModule,
    FtHourlyRateLimitModule,
    FtSecondlyRateLimitModule,
    AuthModule,
    UsersModule,
    FtCalSwaggerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
