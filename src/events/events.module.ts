import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { FtApiModule } from '../ft-api/ft-api.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule, FtApiModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
