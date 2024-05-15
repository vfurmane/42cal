import ical, { ICalCalendarData } from 'ical-generator';
import { FindEventsResponseDto } from '../../ft-api/dto/find-events-response.dto';

export function createIcalFromEvents(config: ICalCalendarData) {
  return (events: FindEventsResponseDto) => {
    const calendar = ical(config);
    events.forEach(({ begin_at, end_at, name, description, location }) => {
      calendar.createEvent({
        start: begin_at,
        end: end_at,
        summary: name,
        description,
        location,
      });
    });
    return calendar.toString();
  };
}