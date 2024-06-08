import { Inject, Injectable, Logger } from '@nestjs/common';
import { FtService } from '../ft/ft.service.js';
import { ConfigService } from '@nestjs/config';
import { FT_DEFAULT_CAMPUS_ID } from '../common/constants/config/ft-api.js';
import {
  FT_CACHED_EVENTS_CACHE_KEY,
  FT_CACHED_EVENTS_TTL,
  FT_CACHED_LATEST_EVENT_CACHE_KEY,
  FT_DEFAULT_EVENTS_LIST,
} from '../common/constants/cache/ft-api.js';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { FindAllEventsDto } from './dto/find-all-events.dto.js';
import { FindEventsResponseDto } from '../ft-api/dto/find-events-response.dto.js';
import { byCampusIds } from '../common/utils/filter-events/by-campus-ids.js';
import { byCursusIds } from '../common/utils/filter-events/by-cursus-ids.js';
import { byRncp } from '../common/utils/filter-events/by-rncp.js';

@Injectable()
export class EventsService {
  private readonly logger = new Logger(EventsService.name);

  private readonly defaultCampusId: number;

  static pipeFilters(events: FindEventsResponseDto, filters: Array<(event: FindEventsResponseDto[number]) => boolean>) {
    return events.filter((event) => {
      return filters.every((filter) => filter(event));
    });
  }

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

  async findAll({ campusIds, cursusIds, rncp }: FindAllEventsDto) {
    return EventsService.pipeFilters(
      (await this.cacheManager.get<FindEventsResponseDto>(FT_CACHED_EVENTS_CACHE_KEY)) ?? FT_DEFAULT_EVENTS_LIST,
      [byRncp(rncp), byCampusIds(campusIds), byCursusIds(cursusIds)],
    );
  }

  async findLatestEvent() {
    return (await this.cacheManager.get<FindEventsResponseDto[number]>(FT_CACHED_LATEST_EVENT_CACHE_KEY)) ?? null;
  }

  async findAllFromDefaultCampus() {
    return this.ftService.findAllEventsByCampusId(this.defaultCampusId);
  }
}
