import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { EventsService } from '../events/events.service';
import { FT_EVENTS_CACHE_REVALIDATION_INTERVAL } from '../common/constants/ft-api-cache';

@Injectable()
export class TasksService {
  constructor(private readonly eventsService: EventsService) {
    this.fetchAll42Events();
  }

  @Interval(FT_EVENTS_CACHE_REVALIDATION_INTERVAL)
  async fetchAll42Events() {
    await this.eventsService.prefetchAllEvents();
  }
}
