import parseLinkHeader from 'parse-link-header';

export async function getNextLinkFromHeaders<T>(
  responseAndData: Promise<{ response: Response; data: Array<T> }>,
  linkHeaderKey: string,
) {
  const { response, data } = await responseAndData;

  const linkHeader = parseLinkHeader(response.headers.get(linkHeaderKey));

  return { data, nextLink: linkHeader !== null ? linkHeader.next?.url ?? null : null };
}
