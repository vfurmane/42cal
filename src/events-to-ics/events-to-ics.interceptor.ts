import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { ICalCalendarData } from 'ical-generator';
import { FindEventsResponseDto } from '../ft-api/dto/find-events-response.dto';
import { createIcalFromEvents } from '../common/utils/create-ical-from-events';
import { setResponseContentType } from '../common/utils/set-response-content-type';

@Injectable()
export class EventsToIcsInterceptor implements NestInterceptor {
  constructor(private readonly config: ICalCalendarData) {}

  intercept(context: ExecutionContext, next: CallHandler<FindEventsResponseDto>): Observable<unknown> {
    return next
      .handle()
      .pipe(
        map(createIcalFromEvents(this.config)),
        tap(setResponseContentType(context, 'Content-Type', 'text/calendar')),
      );
  }
}
