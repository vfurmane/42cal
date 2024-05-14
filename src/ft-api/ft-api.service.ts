import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { getDataFromResponseOrThrow } from '../common/utils/get-data-from-response-or-throw';
import { clientCredentialsAuthSchema } from './dto/client-credentials-auth.dto';
import { FT_API_REGULAR_ERROR_MESSAGE } from '../common/constants/error-messages';
import { FT_API_CONFIG_BASE_URL, FT_API_CONFIG_DEFAULT_SCOPE } from '../common/constants/ft-api-config';
import { ConfigService } from '@nestjs/config';
import { findEventsResponseSchema } from './dto/find-events-response.dto';
import { SIMPLE_CLIENT_CREDENTIALS_PROVIDER } from '../simple-client-credentials/simple-client-credentials.module';
import { ClientCredentials } from 'simple-oauth2';

@Injectable()
export class FtApiService {
  private readonly apiBaseUrl: string;
  private readonly apiDefaultScope: string;

  constructor(
    private readonly configService: ConfigService,
    @Inject(SIMPLE_CLIENT_CREDENTIALS_PROVIDER) private readonly simpleClientCredentials: ClientCredentials,
  ) {
    this.apiBaseUrl = this.configService.getOrThrow(FT_API_CONFIG_BASE_URL);
    this.apiDefaultScope = this.configService.getOrThrow(FT_API_CONFIG_DEFAULT_SCOPE);
  }

  private async getAccessToken() {
    const auth = await this.simpleClientCredentials.getToken({ scope: this.apiDefaultScope });

    try {
      return clientCredentialsAuthSchema.parse(auth.token);
    } catch {
      throw new InternalServerErrorException(FT_API_REGULAR_ERROR_MESSAGE);
    }
  }

  private async fetchApi(route: string, init?: RequestInit) {
    const { tokenType, accessToken } = await this.getAccessToken();
    return fetch(`${this.apiBaseUrl}/${route}`, {
      headers: { Authorization: `${tokenType} ${accessToken}`, ...init?.headers },
      ...init,
    }).then((res) => {
      return res;
    });
  }

  async findAllEvents() {
    return getDataFromResponseOrThrow(this.fetchApi(`v2/events`), {
      response: findEventsResponseSchema,
    });
  }

  async findAllEventsByCampusId(campusId: number) {
    return getDataFromResponseOrThrow(this.fetchApi(`v2/campus/${campusId}/events`), {
      response: findEventsResponseSchema,
    });
  }
}
