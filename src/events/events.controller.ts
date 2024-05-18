import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsToIcsInterceptor } from '../events-to-ics/events-to-ics.interceptor.js';
import { CALENDAR_NAME_ALL_EVENTS } from '../common/constants/calendars-name.js';
import { FindAllEventsDto } from './dto/find-all-events.dto.js';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(new EventsToIcsInterceptor({ name: CALENDAR_NAME_ALL_EVENTS }))
  findAll(@Query() query: FindAllEventsDto) {
    return this.eventsService.findAll(query);
  }
}
