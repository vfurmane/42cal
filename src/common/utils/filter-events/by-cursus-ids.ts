import { FindEventsResponseDto } from '../../../ft-api/dto/find-events-response.dto.js';
import { FindAllEventsDto } from '../../../events/dto/find-all-events.dto.js';

export function byCursusIds(cursusIds: FindAllEventsDto['cursusIds']) {
  return (event: FindEventsResponseDto[number]) => {
    if (cursusIds === undefined) {
      return true;
    }
    return event.cursus_ids.some((cursusId) => cursusIds.includes(cursusId));
  };
}
