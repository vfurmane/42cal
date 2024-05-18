import { Module } from '@nestjs/common';
import { FtService } from './ft.service';
import { FtApiModule } from '../ft-api/ft-api.module';

@Module({
  imports: [FtApiModule],
  providers: [FtService],
  exports: [FtService],
})
export class FtModule {}
