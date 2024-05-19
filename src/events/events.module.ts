import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsController } from './events.controller.js';
import { FtModule } from '../ft/ft.module.js';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { BasicQueryToHeaderMiddleware } from '../basic-query-to-header/basic-query-to-header.middleware.js';

@Module({
  imports: [CacheModule.register(), ConfigModule, FtModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(BasicQueryToHeaderMiddleware).forRoutes(EventsController);
  }
}
