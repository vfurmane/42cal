import { ZodType } from 'zod';
import { FT_API_REGULAR_ERROR_MESSAGE } from '../../../constants/errors/ft-api.js';
import { getJsonDataOrThrow } from './get-json-data-or-throw.js';
import { throwOnErrorResponse } from './throw-on-error-response.js';

export async function getDataFromResponseOrThrow<T>(
  rawResponse: Response | Promise<Response>,
  schema: { response: ZodType<T> },
): Promise<T> {
  const { data } = await getJsonDataOrThrow(
    throwOnErrorResponse(rawResponse, FT_API_REGULAR_ERROR_MESSAGE),
    schema,
    FT_API_REGULAR_ERROR_MESSAGE,
  );

  return data;
}
