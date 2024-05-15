import { startRateLimitedTask } from './start-rate-limited-task';

export async function doWithRateLimitWhile<ParamsType extends Array<unknown>>(
  doFn: (...args: ParamsType) => ParamsType | Promise<ParamsType>,
  whileFn: (...args: ParamsType) => boolean,
  rateLimitWait: number,
  ...args: ParamsType
) {
  let lastResult = args;

  let sleep = () => Promise.resolve();
  do {
    await sleep();
    lastResult = await doFn(...lastResult);
    sleep = startRateLimitedTask(rateLimitWait);
  } while (whileFn(...lastResult));

  return lastResult;
}
