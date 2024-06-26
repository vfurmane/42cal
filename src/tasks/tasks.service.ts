import { Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { EventsService } from '../events/events.service.js';
import { FT_EVENTS_CACHE_REVALIDATION_INTERVAL } from '../common/constants/cache/ft-api.js';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(private readonly eventsService: EventsService) {}

  async onModuleInit() {
    return this.eventsService.prefetchAllFutureEvents();
  }

  @Interval(FT_EVENTS_CACHE_REVALIDATION_INTERVAL)
  async prefetchAllFuture42Events() {
    await this.eventsService.prefetchAllFutureEvents();
  }
}
