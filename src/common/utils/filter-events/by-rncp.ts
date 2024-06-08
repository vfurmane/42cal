import { FindEventsResponseDto } from '../../../ft-api/dto/find-events-response.dto.js';
import { FindAllEventsDto } from '../../../events/dto/find-all-events.dto.js';
import { RNCP_EVENT_KINDS } from '../../constants/events.js';

export function byRncp(rncp: FindAllEventsDto['rncp']) {
  return (event: Pick<FindEventsResponseDto[number], 'kind'>) => {
    if (rncp === undefined) {
      return true;
    }
    return rncp === RNCP_EVENT_KINDS.includes(event.kind);
  };
}
