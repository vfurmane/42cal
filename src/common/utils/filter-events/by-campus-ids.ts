import { FindEventsResponseDto } from '../../../ft-api/dto/find-events-response.dto.js';
import { FindAllEventsDto } from '../../../events/dto/find-all-events.dto.js';

export function byCampusIds(campusIds: FindAllEventsDto['campusIds']) {
  return (event: FindEventsResponseDto[number]) => {
    if (campusIds === undefined) {
      return true;
    }
    return event.campus_ids.some((campusId) => campusIds.includes(campusId));
  };
}
