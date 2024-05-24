export function setPageInRoute(route: string, pageKey: string, pageNumber: number) {
  const url = new URL(route);
  url.searchParams.set(pageKey, pageNumber.toString());
  return url.toString();
}

export function setPageNumberInRoute(route: string, pageNumberKey: string, pageNumberValue: number) {
  const url = new URL(route);
  url.searchParams.set(pageNumberKey, pageNumberValue.toString());
  return url.toString();
}
