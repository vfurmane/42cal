import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { clientCredentialsAuthSchema } from './dto/client-credentials-auth.dto.js';
import { FT_API_REGULAR_ERROR_MESSAGE } from '../common/constants/error-messages.js';
import {
  FT_API_CONFIG_BASE_URL,
  FT_API_CONFIG_DEFAULT_SCOPE,
  FT_API_CONFIG_PAGINATION_SEARCH_PARAM_KEY,
  FT_API_CONFIG_PAGINATION_FIRST_PAGE_NUMBER,
  FT_API_CONFIG_PAGINATION_LINKS_HEADER,
} from '../common/constants/ft-api-config.js';
import { ConfigService } from '@nestjs/config';
import { SIMPLE_CLIENT_CREDENTIALS_PROVIDER } from '../simple-client-credentials/simple-client-credentials.module.js';
import { ClientCredentials } from 'simple-oauth2';
import { setPageInRoute } from '../common/utils/set-page-in-route.js';
import { getDataAndNextLinkFromResponseOrThrow } from '../common/utils/get-data-and-next-link-from-response-or-throw.js';
import { FetchSchemas } from '../common/utils/get-json-data-or-throw.js';
import { FtSecondlyRateLimitService } from '../ft-secondly-rate-limit/ft-secondly-rate-limit.service.js';
import { FtHourlyRateLimitService } from '../ft-hourly-rate-limit/ft-hourly-rate-limit.service.js';
import { getDataFromResponseOrThrow } from '../common/utils/get-data-from-response-or-throw.js';

export type RequestWithSchemas<T> = RequestInit & { schema: FetchSchemas<Array<T>> };

@Injectable()
export class FtApiService {
  private readonly apiBaseUrl: string;
  private readonly apiDefaultScope: string;
  private readonly apiLinkHeaderKey: string;
  private readonly apiPaginationSearchParamKey: string;
  private readonly apiPaginationFirstPageNumber: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly sQueue: FtSecondlyRateLimitService,
    private readonly hQueue: FtHourlyRateLimitService,
    @Inject(SIMPLE_CLIENT_CREDENTIALS_PROVIDER) private readonly simpleClientCredentials: ClientCredentials,
  ) {
    this.apiBaseUrl = this.configService.getOrThrow(FT_API_CONFIG_BASE_URL);
    this.apiDefaultScope = this.configService.getOrThrow(FT_API_CONFIG_DEFAULT_SCOPE);
    this.apiLinkHeaderKey = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_LINKS_HEADER);
    this.apiPaginationSearchParamKey = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_SEARCH_PARAM_KEY);
    this.apiPaginationFirstPageNumber = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_FIRST_PAGE_NUMBER);
  }

  private generateFirstRouteForPaginatedResource(route: string) {
    return setPageInRoute(route, this.apiPaginationSearchParamKey, this.apiPaginationFirstPageNumber);
  }

  private async getAccessToken() {
    const auth = await this.simpleClientCredentials.getToken({ scope: this.apiDefaultScope });

    try {
      return clientCredentialsAuthSchema.parse(auth.token);
    } catch {
      throw new InternalServerErrorException(FT_API_REGULAR_ERROR_MESSAGE);
    }
  }

  private async fetchWithRateLimiting(route: string, init?: RequestInit): Promise<Response> {
    const response = await this.hQueue.add(() =>
      this.sQueue.add(async () => {
        return fetch(route, init).then((res) => {
          return res;
        });
      }),
    );
    if (response === undefined) {
      throw new InternalServerErrorException(FT_API_REGULAR_ERROR_MESSAGE);
    }
    return response;
  }

  private async fetchWithAccessToken(route: string, init?: RequestInit) {
    const { tokenType, accessToken } = await this.getAccessToken();
    return this.fetchWithRateLimiting(route, {
      headers: { Authorization: `${tokenType} ${accessToken}`, ...init?.headers },
      ...init,
    });
  }

  async fetchApi<T>(route: string, init: RequestWithSchemas<T>) {
    return getDataFromResponseOrThrow(this.fetchWithAccessToken(`${this.apiBaseUrl}/${route}`, init), init.schema);
  }

  async fetchApiAllPages<T>(baseRoute: string, init: RequestWithSchemas<T>): Promise<Array<T>> {
    let result: Array<T> = [];
    let route: string | null = this.generateFirstRouteForPaginatedResource(`${this.apiBaseUrl}/${baseRoute}`);
    do {
      const { data, nextLink } = await getDataAndNextLinkFromResponseOrThrow(
        this.fetchWithAccessToken(route, init),
        init.schema,
        this.apiLinkHeaderKey,
      );
      result = result.concat(data);
      route = nextLink;
    } while (route !== null);
    return result;
  }
}
