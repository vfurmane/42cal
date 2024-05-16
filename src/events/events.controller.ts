import { Controller, Get, ParseArrayPipe, Query, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsToIcsInterceptor } from '../events-to-ics/events-to-ics.interceptor';
import { CALENDAR_NAME_ALL_EVENTS } from '../common/constants/calendars-name';
import { FindAllEventsDto } from './dto/find-all-events.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @UseInterceptors(new EventsToIcsInterceptor({ name: CALENDAR_NAME_ALL_EVENTS }))
  findAll(
    @Query('campusIds', new ParseArrayPipe({ items: Number, separator: ',' })) campusIds: FindAllEventsDto['campusIds'],
  ) {
    return this.eventsService.findAll({ campusIds });
  }
}
