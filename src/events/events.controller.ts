import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsToIcsInterceptor } from '../events-to-ics/events-to-ics.interceptor';
import { CALENDAR_NAME_ALL_EVENTS } from '../common/constants/calendars-name';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(new EventsToIcsInterceptor({ name: CALENDAR_NAME_ALL_EVENTS }))
  findAll() {
    return this.eventsService.findAllFromDefaultCampus();
  }
}
