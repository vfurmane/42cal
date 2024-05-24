import { FindEventsResponseDto } from '../../../ft-api/dto/find-events-response.dto.js';

export function lastItemIsAlreadyCached(
  latestEvent: FindEventsResponseDto[number],
  lastItem?: FindEventsResponseDto[number],
) {
  return lastItem === undefined || lastItem.id >= latestEvent.id;
}
