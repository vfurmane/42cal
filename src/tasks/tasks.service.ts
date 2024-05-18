import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { EventsService } from '../events/events.service.js';
import { FT_EVENTS_CACHE_REVALIDATION_INTERVAL } from '../common/constants/ft-api-cache.js';

@Injectable()
export class TasksService {
  constructor(private readonly eventsService: EventsService) {
    this.fetchAllFuture42Events();
  }

  @Interval(FT_EVENTS_CACHE_REVALIDATION_INTERVAL)
  async fetchAllFuture42Events() {
    await this.eventsService.prefetchAllFutureEvents();
  }
}
