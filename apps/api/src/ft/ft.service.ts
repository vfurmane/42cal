import { Injectable, Logger } from '@nestjs/common';
import { FindEventsResponseDto, findEventsResponseSchema } from '../ft-api/dto/find-events-response.dto.js';
import { FetchUntilFunction, FtApiService } from '../ft-api/ft-api.service.js';

@Injectable()
export class FtService {
  private readonly logger = new Logger(FtService.name);

  constructor(private readonly ftApiService: FtApiService) {}

  async findAllFutureEvents() {
    return this.ftApiService.fetchApiAllPages('v2/events?filter[future]=true', {
      schema: { response: findEventsResponseSchema },
    });
  }

  async findAllEvents(untilFn?: FetchUntilFunction<FindEventsResponseDto[number]>) {
    this.logger.verbose(`Finding all events at 42 (untilFn is ${untilFn ? 'set' : 'unset'})`);
    return this.ftApiService.fetchApiAllPages(
      'v2/events',
      {
        schema: { response: findEventsResponseSchema },
      },
      untilFn,
    );
  }

  async findAllEventsByCampusId(campusId: number) {
    return this.ftApiService.fetchApi(`v2/campus/${campusId}/events`, {
      schema: {
        response: findEventsResponseSchema,
      },
    });
  }
}
