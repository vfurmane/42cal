import { FindEventsResponseDto } from '../../ft-api/dto/find-events-response.dto.js';
import { FindAllEventsDto } from '../../events/dto/find-all-events.dto.js';

export function filterEventsByCampusIds(events: FindEventsResponseDto, campusIds: FindAllEventsDto['campusIds']) {
  if (campusIds === undefined) {
    return events;
  }
  return events.filter((event) => {
    return event.campus_ids.some((campusId) => campusIds.includes(campusId));
  });
}
