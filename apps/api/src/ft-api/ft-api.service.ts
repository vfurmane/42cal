import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { clientCredentialsAuthSchema } from './dto/client-credentials-auth.dto.js';
import { FT_API_REGULAR_ERROR_MESSAGE } from '../common/constants/errors/ft-api.js';
import {
  FT_API_CONFIG_BASE_URL,
  FT_API_CONFIG_DEFAULT_SCOPE,
  FT_API_CONFIG_PAGINATION_SEARCH_PARAM_KEY,
  FT_API_CONFIG_PAGINATION_FIRST_PAGE_NUMBER,
  FT_API_CONFIG_PAGINATION_LINKS_HEADER,
  FT_API_CONFIG_PAGINATION_MAX_DEPTH,
  FT_API_CONFIG_PAGINATION_SIZE,
  FT_API_CONFIG_PAGINATION_SIZE_SEARCH_PARAM_KEY,
} from '../common/constants/config/ft-api.js';
import { ConfigService } from '@nestjs/config';
import { SIMPLE_CLIENT_CREDENTIALS_PROVIDER } from '../simple-client-credentials/simple-client-credentials.module.js';
import { ClientCredentials } from 'simple-oauth2';
import { setPageInRoute, setPageNumberInRoute } from '../common/utils/fetch/request/set-page-in-route.js';
import { getDataAndNextLinkFromResponseOrThrow } from '../common/utils/fetch/response/get-data-and-next-link-from-response-or-throw.js';
import { FetchSchemas } from '../common/utils/fetch/response/get-json-data-or-throw.js';
import { FtSecondlyRateLimitService } from '../ft-secondly-rate-limit/ft-secondly-rate-limit.service.js';
import { FtHourlyRateLimitService } from '../ft-hourly-rate-limit/ft-hourly-rate-limit.service.js';
import { getDataFromResponseOrThrow } from '../common/utils/fetch/response/get-data-from-response-or-throw.js';

export type RequestWithSchemas<T> = RequestInit & { schema: FetchSchemas<Array<T>> };
export type FetchUntilFunctionItems<T> = {
  iteration: number;
  result: Array<T>;
};
export type FetchUntilFunction<T> = (items: FetchUntilFunctionItems<T>) => boolean;

@Injectable()
export class FtApiService {
  private readonly logger = new Logger(FtApiService.name);

  private readonly apiBaseUrl: string;
  private readonly apiDefaultScope: string;
  private readonly apiLinkHeaderKey: string;
  private readonly apiPaginationMaxDepth: number;
  private readonly apiPaginationSearchParamKey: string;
  private readonly apiPaginationFirstPageNumber: number;
  private readonly apiPaginationSizeSearchParamKey: string;
  private readonly apiPaginationSize: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly sQueue: FtSecondlyRateLimitService,
    private readonly hQueue: FtHourlyRateLimitService,
    @Inject(SIMPLE_CLIENT_CREDENTIALS_PROVIDER) private readonly simpleClientCredentials: ClientCredentials,
  ) {
    this.apiBaseUrl = this.configService.getOrThrow(FT_API_CONFIG_BASE_URL);
    this.apiDefaultScope = this.configService.getOrThrow(FT_API_CONFIG_DEFAULT_SCOPE);
    this.apiLinkHeaderKey = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_LINKS_HEADER);
    this.apiPaginationMaxDepth = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_MAX_DEPTH);
    this.apiPaginationSearchParamKey = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_SEARCH_PARAM_KEY);
    this.apiPaginationFirstPageNumber = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_FIRST_PAGE_NUMBER);
    this.apiPaginationSizeSearchParamKey = this.configService.getOrThrow(
      FT_API_CONFIG_PAGINATION_SIZE_SEARCH_PARAM_KEY,
    );
    this.apiPaginationSize = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_SIZE);
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

  async fetchApiAllPages<T>(
    baseRoute: string,
    init: RequestWithSchemas<T>,
    untilFn?: FetchUntilFunction<T>,
  ): Promise<Array<T>> {
    let iteration = 0;
    let result: Array<T> = [];
    let route: string | null = this.generateFirstRouteForPaginatedResource(`${this.apiBaseUrl}/${baseRoute}`);
    do {
      route = setPageNumberInRoute(route, this.apiPaginationSizeSearchParamKey, this.apiPaginationSize);
      this.logger.verbose(`Fetching route '${route}' (iteration is ${iteration})`);
      const { data, nextLink } = await getDataAndNextLinkFromResponseOrThrow(
        this.fetchWithAccessToken(route, init),
        init.schema,
        this.apiLinkHeaderKey,
      );
      ++iteration;
      result = result.concat(data);
      route = nextLink;
    } while (
      route !== null &&
      iteration < this.apiPaginationMaxDepth &&
      (untilFn === undefined || !untilFn({ iteration, result }))
    );
    return result;
  }
}
