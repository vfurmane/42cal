import { Injectable, NestMiddleware } from '@nestjs/common';
import { AUTH_BASIC_HEADER_KEY, AUTH_BASIC_QUERY_PARAM_KEY } from '../common/constants/auth.js';
import { Request, Response } from 'express';

@Injectable()
export class BasicQueryToHeaderMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const queryParam = req.query[AUTH_BASIC_QUERY_PARAM_KEY];
    if (queryParam !== undefined) {
      req.headers[AUTH_BASIC_HEADER_KEY] = `Basic ${req.query[AUTH_BASIC_QUERY_PARAM_KEY]}`;
    }
    next();
  }
}
