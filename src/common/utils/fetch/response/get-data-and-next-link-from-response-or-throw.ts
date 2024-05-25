import { FetchSchemas, getJsonDataOrThrow } from './get-json-data-or-throw.js';
import { throwOnErrorResponse } from './throw-on-error-response.js';
import { FT_API_REGULAR_ERROR_MESSAGE } from '../../../constants/errors/ft-api.js';
import { getNextLinkFromHeaders } from './get-next-link-from-headers.js';

export async function getDataAndNextLinkFromResponseOrThrow<T>(
  rawResponse: Response | Promise<Response>,
  schema: FetchSchemas<Array<T>>,
  linkHeaderKey: string,
) {
  return getNextLinkFromHeaders(
    getJsonDataOrThrow(
      throwOnErrorResponse(rawResponse, FT_API_REGULAR_ERROR_MESSAGE),
      schema,
      FT_API_REGULAR_ERROR_MESSAGE,
    ),
    linkHeaderKey,
  );
}
