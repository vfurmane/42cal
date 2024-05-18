import { Module } from '@nestjs/common';
import { FtService } from './ft.service.js';
import { FtApiModule } from '../ft-api/ft-api.module.js';

@Module({
  imports: [FtApiModule],
  providers: [FtService],
  exports: [FtService],
})
export class FtModule {}
