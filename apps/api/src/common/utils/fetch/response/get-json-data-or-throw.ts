import { InternalServerErrorException } from '@nestjs/common';
import { ZodType } from 'zod';

export type FetchSchemas<ResponseType> = { response: ZodType<ResponseType> };

export async function getJsonDataOrThrow<T>(
  rawResponse: Response | Promise<Response>,
  schema: FetchSchemas<T>,
  errorMessage: string,
): Promise<{ response: Response; data: T }> {
  const response = await rawResponse;

  const unverifiedJson = await response.json();

  try {
    return { response, data: schema.response.parse(unverifiedJson) };
  } catch {
    throw new InternalServerErrorException(errorMessage);
  }
}
