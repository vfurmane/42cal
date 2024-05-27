import { ExecutionContext } from '@nestjs/common';

export function setResponseContentType(context: ExecutionContext, key: string, value: string) {
  return () => {
    const res = context.switchToHttp().getResponse();
    res.setHeader(key, value);
  };
}
