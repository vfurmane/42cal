import { Module } from '@nestjs/common';
import { PQueueModule } from '../p-queue/p-queue.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FT_API_CONFIG_HOURLY_INTERVAL, FT_API_CONFIG_REQUESTS_PER_HOUR } from '../common/constants/config/ft-api.js';
import { FtHourlyRateLimitService } from './ft-hourly-rate-limit.service.js';
import PQueue from 'p-queue';

@Module({
  imports: [
    PQueueModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        interval: configService.getOrThrow(FT_API_CONFIG_HOURLY_INTERVAL),
        intervalCap: configService.getOrThrow(FT_API_CONFIG_REQUESTS_PER_HOUR),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: FtHourlyRateLimitService,
      useExisting: PQueue,
    },
  ],
  exports: [FtHourlyRateLimitService],
})
export class FtHourlyRateLimitModule {}
