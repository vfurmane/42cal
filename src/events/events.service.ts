import { Injectable } from '@nestjs/common';
import { FtApiService } from '../ft-api/ft-api.service';
import { ConfigService } from '@nestjs/config';
import { FT_DEFAULT_CAMPUS_ID } from '../common/constants/ft-api-config';

@Injectable()
export class EventsService {
  private readonly defaultCampusId: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly ftApiService: FtApiService,
  ) {
    this.defaultCampusId = this.configService.getOrThrow(FT_DEFAULT_CAMPUS_ID);
  }

  async findAll() {
    return this.ftApiService.findAllEvents();
  }

  async findAllFromDefaultCampus() {
    return this.ftApiService.findAllEventsByCampusId(this.defaultCampusId);
  }
}
