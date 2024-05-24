import { Inject, Injectable, Logger } from '@nestjs/common';
import { FtService } from '../ft/ft.service.js';
import { ConfigService } from '@nestjs/config';
import { FT_DEFAULT_CAMPUS_ID } from '../common/constants/ft-api-config.js';
import {
  FT_CACHED_EVENTS_CACHE_KEY,
  FT_CACHED_EVENTS_TTL,
  FT_CACHED_LATEST_EVENT_CACHE_KEY,
  FT_DEFAULT_EVENTS_LIST,
} from '../common/constants/ft-api-cache.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FindAllEventsDto } from './dto/find-all-events.dto.js';
import { FindEventsResponseDto } from '../ft-api/dto/find-events-response.dto.js';
import { filterEvents } from '../common/utils/filter-events/filter-events.js';
import { byCampusIds } from '../common/utils/filter-events/by-campus-ids.js';
import { byCursusIds } from '../common/utils/filter-events/by-cursus-ids.js';
import { FetchUntilFunction } from '../ft-api/ft-api.service.js';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  private readonly defaultCampusId: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly ftService: FtService,
  ) {
    this.defaultCampusId = this.configService.getOrThrow(FT_DEFAULT_CAMPUS_ID);
  }

  async setCache(events: FindEventsResponseDto) {
    this.logger.verbose('Setting events cache');

    return Promise.all([
      this.cacheManager.set(FT_CACHED_EVENTS_CACHE_KEY, events, FT_CACHED_EVENTS_TTL),
      this.cacheManager.set(FT_CACHED_LATEST_EVENT_CACHE_KEY, events[0], FT_CACHED_EVENTS_TTL),
    ]);
  }

  async prefetchAllFutureEvents() {
    const events = await this.ftService.findAllFutureEvents();
    await this.setCache(events);
  }

  async prefetchAllEvents(untilFn?: FetchUntilFunction<FindEventsResponseDto[number]>) {
    const events = await this.ftService.findAllEvents(untilFn);
    await this.setCache(events);
  }

  async findAll({ campusIds, cursusIds }: FindAllEventsDto) {
    return filterEvents(
      (await this.cacheManager.get<FindEventsResponseDto>(FT_CACHED_EVENTS_CACHE_KEY)) ?? FT_DEFAULT_EVENTS_LIST,
      [byCampusIds(campusIds), byCursusIds(cursusIds)],
    );
  }

  async findLatestEvent() {
    return (await this.cacheManager.get<FindEventsResponseDto[number]>(FT_CACHED_LATEST_EVENT_CACHE_KEY)) ?? null;
  }

  async findAllFromDefaultCampus() {
    return this.ftService.findAllEventsByCampusId(this.defaultCampusId);
  }
}
