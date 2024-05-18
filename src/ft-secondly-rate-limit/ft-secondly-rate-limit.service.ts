import { Injectable } from '@nestjs/common';
import PQueue from 'p-queue';

@Injectable()
export class FtSecondlyRateLimitService extends PQueue {}
