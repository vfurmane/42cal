import { Injectable, OnModuleInit } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { EventsService } from '../events/events.service.js';
import { FT_EVENTS_CACHE_REVALIDATION_INTERVAL } from '../common/constants/ft-api-cache.js';
import { prefetchAll42EventsUntil } from '../common/utils/prefetch-all-42-events-until/prefetch-all-42-events-until.js';

@Injectable()
export class TasksService implements OnModuleInit {
  constructor(private readonly eventsService: EventsService) {}

  async onModuleInit() {
    return this.eventsService.prefetchAllEvents();
  }

  @Interval(FT_EVENTS_CACHE_REVALIDATION_INTERVAL)
  async fetchAll42Events() {
    const latestEvent = await this.eventsService.findLatestEvent();
    await this.eventsService.prefetchAllEvents(
      latestEvent !== null ? prefetchAll42EventsUntil(latestEvent) : undefined,
    );
  }
}
