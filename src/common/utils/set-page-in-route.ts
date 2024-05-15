export function setPageInRoute(route: string, pageKey: string, pageNumber: number) {
  const url = new URL(route);
  url.searchParams.set(pageKey, pageNumber.toString());
  return url.toString();
}
