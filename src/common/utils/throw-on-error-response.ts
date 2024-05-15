import { InternalServerErrorException } from '@nestjs/common';

export async function throwOnErrorResponse(rawResponse: Response | Promise<Response>, errorMessage: string) {
  const response = await rawResponse;

  if (!response.ok) {
    throw new InternalServerErrorException(errorMessage);
  }

  return response;
}
