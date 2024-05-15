import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { FtApiModule } from './ft-api/ft-api.module';
import { ConfigModule } from '@nestjs/config';
import { ftApiConfig } from './common/config/ft-api';
import { TasksModule } from './tasks/tasks.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    EventsModule,
    FtApiModule,
    ConfigModule.forRoot({
      load: [ftApiConfig],
    }),
    ScheduleModule.forRoot(),
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
