export function startRateLimitedTask(rateLimitWait: number) {
  const promise = new Promise<void>((resolve) => {
    setTimeout(resolve, rateLimitWait);
  });

  return () => {
    return promise;
  };
}
