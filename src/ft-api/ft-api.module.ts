import { Module } from '@nestjs/common';
import { FtApiService } from './ft-api.service';
import { SimpleClientCredentialsModule } from '../simple-client-credentials/simple-client-credentials.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  FT_API_CONFIG_BASE_URL,
  FT_API_CONFIG_CLIENT_ID,
  FT_API_CONFIG_CLIENT_SECRET,
} from '../common/constants/ft-api-config';

@Module({
  imports: [
    ConfigModule,
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
