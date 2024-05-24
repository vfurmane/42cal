import { FindEventsResponseDto } from '../../../ft-api/dto/find-events-response.dto.js';
import { FetchUntilFunctionItems } from '../../../ft-api/ft-api.service.js';
import { lastItemIsAlreadyCached } from './last-item-is-already-cached.js';

export function prefetchAll42EventsUntil(latestEvent: FindEventsResponseDto[number]) {
  return ({ result }: FetchUntilFunctionItems<FindEventsResponseDto[number]>) => {
    if (result.length === 0) {
      return true;
    }
    const lastItem = result[result.length - 1];
    return lastItemIsAlreadyCached(latestEvent, lastItem);
  };
}
