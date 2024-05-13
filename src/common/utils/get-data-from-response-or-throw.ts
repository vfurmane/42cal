import { InternalServerErrorException } from '@nestjs/common';
import { ZodType } from 'zod';

export async function getDataFromResponseOrThrow<T>(
  rawResponse: Response | Promise<Response>,
  schema: { response: ZodType<T> },
): Promise<T> {
  const response = await rawResponse;

  if (!response.ok) {
    throw new InternalServerErrorException(FT_API_REGULAR_ERROR_MESSAGE);
  }

  const unverifiedJson = await response.json();

  try {
    return schema.response.parse(unverifiedJson);
  } catch {
    throw new InternalServerErrorException(FT_API_REGULAR_ERROR_MESSAGE);
  }
}
