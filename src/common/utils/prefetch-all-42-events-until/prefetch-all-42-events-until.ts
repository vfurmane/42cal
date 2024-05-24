import { FindEventsResponseDto } from '../../../ft-api/dto/find-events-response.dto.js';
import { FetchUntilFunctionItems } from '../../../ft-api/ft-api.service.js';
import { lastItemIsAlreadyCached } from './last-item-is-already-cached.js';

export function prefetchAll42EventsUntil(latestEvent: FindEventsResponseDto[number]) {
  return ({ lastItem }: FetchUntilFunctionItems<FindEventsResponseDto[number]>) =>
    lastItemIsAlreadyCached(latestEvent, lastItem);
}
