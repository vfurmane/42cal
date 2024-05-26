import { Injectable } from '@nestjs/common';
import PQueue from 'p-queue';

@Injectable()
export class FtHourlyRateLimitService extends PQueue {}
