import { Injectable } from '@nestjs/common';
import { findEventsResponseSchema } from '../ft-api/dto/find-events-response.dto';
import { getDataFromResponseOrThrow } from '../common/utils/get-data-from-response-or-throw';
import { FtApiService } from '../ft-api/ft-api.service';

@Injectable()
export class FtService {
  constructor(private readonly ftApiService: FtApiService) {}

  async findAllFutureEvents() {
    return this.ftApiService.fetchApiAllPages('v2/events?filter[future]=true', {
      schema: { response: findEventsResponseSchema },
    });
  }

  async findAllEventsByCampusId(campusId: number) {
    return getDataFromResponseOrThrow(this.ftApiService.fetchApi(`v2/campus/${campusId}/events`), {
      response: findEventsResponseSchema,
    });
  }
}
