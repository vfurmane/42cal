import { Inject, Injectable } from '@nestjs/common';
import { FtService } from '../ft/ft.service';
import { ConfigService } from '@nestjs/config';
import { FT_DEFAULT_CAMPUS_ID } from '../common/constants/ft-api-config';
import {
  FT_CACHED_EVENTS_CACHE_KEY,
  FT_CACHED_EVENTS_TTL,
  FT_DEFAULT_EVENTS_LIST,
} from '../common/constants/ft-api-cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FindAllEventsDto } from './dto/find-all-events.dto';
import { FindEventsResponseDto } from '../ft-api/dto/find-events-response.dto';
import { filterEventsByCampusIds } from '../common/utils/filter-events-by-campus-ids';

@Injectable()
export class EventsService {
  private readonly defaultCampusId: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly ftService: FtService,
  ) {
    this.defaultCampusId = this.configService.getOrThrow(FT_DEFAULT_CAMPUS_ID);
  }

  async prefetchAllFutureEvents() {
    const events = await this.ftService.findAllFutureEvents();
    await this.cacheManager.set(FT_CACHED_EVENTS_CACHE_KEY, events, FT_CACHED_EVENTS_TTL);
  }

  async findAll({ campusIds }: FindAllEventsDto) {
    return filterEventsByCampusIds(
      (await this.cacheManager.get<FindEventsResponseDto>(FT_CACHED_EVENTS_CACHE_KEY)) ?? FT_DEFAULT_EVENTS_LIST,
      campusIds,
    );
  }

  async findAllFromDefaultCampus() {
    return this.ftService.findAllEventsByCampusId(this.defaultCampusId);
  }
}
