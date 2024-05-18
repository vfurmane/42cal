import { Module } from '@nestjs/common';
import { FtSecondlyRateLimitService } from './ft-secondly-rate-limit.service.js';
import { PQueueModule } from '../p-queue/p-queue.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  FT_API_CONFIG_REQUESTS_PER_SECOND,
  FT_API_CONFIG_SECONDLY_INTERVAL,
} from '../common/constants/ft-api-config.js';
import PQueue from 'p-queue';

@Module({
  imports: [
    PQueueModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        interval: configService.getOrThrow(FT_API_CONFIG_SECONDLY_INTERVAL),
        intervalCap: configService.getOrThrow(FT_API_CONFIG_REQUESTS_PER_SECOND),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: FtSecondlyRateLimitService,
      useExisting: PQueue,
    },
  ],
  exports: [FtSecondlyRateLimitService],
})
export class FtSecondlyRateLimitModule {}
