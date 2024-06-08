import { Controller, Get, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventsService } from './events.service.js';
import { EventsToIcsInterceptor } from '../events-to-ics/events-to-ics.interceptor.js';
import { CALENDAR_NAME_ALL_EVENTS } from '../common/constants/calendars.js';
import { FindAllEventsDto } from './dto/find-all-events.dto.js';
import { BasicAuthGuard } from '../auth/basic-auth.guard.js';
import { ApiBasicAuth, ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SWAGGER_EVENTS_ROUTE } from '../common/constants/swagger/events.js';

@ApiTags('events')
@ApiBasicAuth()
@Controller('events')
@UseGuards(BasicAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation(SWAGGER_EVENTS_ROUTE.request)
  @ApiOkResponse(SWAGGER_EVENTS_ROUTE.response.ok)
  @ApiUnauthorizedResponse()
  @UseInterceptors(new EventsToIcsInterceptor({ name: CALENDAR_NAME_ALL_EVENTS }))
  findAll(@Query() query: FindAllEventsDto) {
    return this.eventsService.findAll(query);
  }
}
