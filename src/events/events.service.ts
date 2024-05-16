import { Inject, Injectable } from '@nestjs/common';
import { FtApiService } from '../ft-api/ft-api.service';
import { ConfigService } from '@nestjs/config';
import { FT_DEFAULT_CAMPUS_ID } from '../common/constants/ft-api-config';
import {
  FT_CACHED_EVENTS_CACHE_KEY,
  FT_CACHED_EVENTS_TTL,
  FT_DEFAULT_EVENTS_LIST,
} from '../common/constants/ft-api-cache';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class EventsService {
  private readonly defaultCampusId: number;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly ftApiService: FtApiService,
  ) {
    this.defaultCampusId = this.configService.getOrThrow(FT_DEFAULT_CAMPUS_ID);
  }

  async prefetchAllFutureEvents() {
    const events = await this.ftApiService.findAllFutureEvents();
    await this.cacheManager.set(FT_CACHED_EVENTS_CACHE_KEY, events, FT_CACHED_EVENTS_TTL);
  }

  async findAll() {
    return (await this.cacheManager.get(FT_CACHED_EVENTS_CACHE_KEY)) ?? FT_DEFAULT_EVENTS_LIST;
  }

  async findAllFromDefaultCampus() {
    return this.ftApiService.findAllEventsByCampusId(this.defaultCampusId);
  }
}
