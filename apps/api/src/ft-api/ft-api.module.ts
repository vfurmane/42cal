import { Module } from '@nestjs/common';
import { FtApiService } from './ft-api.service.js';
import { SimpleClientCredentialsModule } from '../simple-client-credentials/simple-client-credentials.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  FT_API_CONFIG_BASE_URL,
  FT_API_CONFIG_CLIENT_ID,
  FT_API_CONFIG_CLIENT_SECRET,
} from '../common/constants/config/ft-api.js';
import { FtSecondlyRateLimitModule } from '../ft-secondly-rate-limit/ft-secondly-rate-limit.module.js';
import { FtHourlyRateLimitModule } from '../ft-hourly-rate-limit/ft-hourly-rate-limit.module.js';

@Module({
  imports: [
    ConfigModule,
    FtSecondlyRateLimitModule,
    FtHourlyRateLimitModule,
    SimpleClientCredentialsModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        client: {
          id: configService.getOrThrow(FT_API_CONFIG_CLIENT_ID),
          secret: configService.getOrThrow(FT_API_CONFIG_CLIENT_SECRET),
        },
        auth: {
          tokenHost: configService.getOrThrow(FT_API_CONFIG_BASE_URL),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [FtApiService],
  exports: [FtApiService],
})
export class FtApiModule {}
