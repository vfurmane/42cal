import { InternalServerErrorException } from '@nestjs/common';

export async function getDataFromResponseOrThrow(rawResponse: Response | Promise<Response>) {
  const response = await rawResponse;

  if (!response.ok) {
    throw new InternalServerErrorException('An error occurred while fetching 42 events');
  }

  return response.json();
}
