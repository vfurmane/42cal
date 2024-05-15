import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { getDataFromResponseOrThrow } from '../common/utils/get-data-from-response-or-throw';
import { clientCredentialsAuthSchema } from './dto/client-credentials-auth.dto';
import { FT_API_REGULAR_ERROR_MESSAGE } from '../common/constants/error-messages';
import {
  FT_API_CONFIG_BASE_URL,
  FT_API_CONFIG_DEFAULT_SCOPE,
  FT_API_CONFIG_RATE_LIMIT_WAIT,
  FT_API_CONFIG_PAGINATION_SEARCH_PARAM_KEY,
  FT_API_CONFIG_PAGINATION_FIRST_PAGE_NUMBER,
  FT_API_CONFIG_PAGINATION_LINKS_HEADER,
} from '../common/constants/ft-api-config';
import { ConfigService } from '@nestjs/config';
import { findEventsResponseSchema } from './dto/find-events-response.dto';
import { SIMPLE_CLIENT_CREDENTIALS_PROVIDER } from '../simple-client-credentials/simple-client-credentials.module';
import { ClientCredentials } from 'simple-oauth2';
import { setPageInRoute } from '../common/utils/set-page-in-route';
import { doWithRateLimitWhile } from '../common/utils/do-with-rate-limit-while';
import { getDataAndNextLinkFromResponseOrThrow } from '../common/utils/get-data-and-next-link-from-response-or-throw';
import { FetchSchemas } from '../common/utils/get-json-data-or-throw';

@Injectable()
export class FtApiService {
  private readonly apiBaseUrl: string;
  private readonly apiDefaultScope: string;
  private readonly apiLinkHeaderKey: string;
  private readonly apiRateLimitWait: number;
  private readonly apiPaginationSearchParamKey: string;
  private readonly apiPaginationFirstPageNumber: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(SIMPLE_CLIENT_CREDENTIALS_PROVIDER) private readonly simpleClientCredentials: ClientCredentials,
  ) {
    this.apiBaseUrl = this.configService.getOrThrow(FT_API_CONFIG_BASE_URL);
    this.apiDefaultScope = this.configService.getOrThrow(FT_API_CONFIG_DEFAULT_SCOPE);
    this.apiLinkHeaderKey = this.configService.getOrThrow(FT_API_CONFIG_PAGINATION_LINKS_HEADER);
    this.apiRateLimitWait = this.configService.getOrThrow(FT_API_CONFIG_RATE_LIMIT_WAIT);
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

  private async fetchWithAccessToken(route: string, init?: RequestInit) {
    const { tokenType, accessToken } = await this.getAccessToken();
    return fetch(route, {
      headers: { Authorization: `${tokenType} ${accessToken}`, ...init?.headers },
      ...init,
    }).then((res) => {
      return res;
    });
  }

  private async fetchApi(route: string, init?: RequestInit) {
    return this.fetchWithAccessToken(`${this.apiBaseUrl}/${route}`, init);
  }

  private async fetchApiAllPages<T>(
    baseRoute: string,
    init: RequestInit & { schema: FetchSchemas<Array<T>> },
  ): Promise<Array<T>> {
    const firstRoute = this.generateFirstRouteForPaginatedResource(`${this.apiBaseUrl}/${baseRoute}`);
    const [result] = await doWithRateLimitWhile<[Array<T>, string | null]>(
      async (result, route) => {
        if (route === null) {
          return [result, route];
        }
        const { data, nextLink } = await getDataAndNextLinkFromResponseOrThrow(
          this.fetchWithAccessToken(route, init),
          init.schema,
          this.apiLinkHeaderKey,
        );
        return [result.concat(data), nextLink];
      },
      (result, nextRoute) => nextRoute !== null,
      this.apiRateLimitWait,
      [],
      firstRoute,
    );
    return result;
  }

  async findAllEvents() {
    return this.fetchApiAllPages('v2/events?filter[future]=true', { schema: { response: findEventsResponseSchema } });
  }

  async findAllEventsByCampusId(campusId: number) {
    return getDataFromResponseOrThrow(this.fetchApi(`v2/campus/${campusId}/events`), {
      response: findEventsResponseSchema,
    });
  }
}
