import { FindEventsResponseDto } from '../../../ft-api/dto/find-events-response.dto.js';

export function filterEvents(
  events: FindEventsResponseDto,
  filters: Array<(event: FindEventsResponseDto[number]) => boolean>,
) {
  return events.filter((event) => {
    return filters.every((filter) => filter(event));
  });
}
