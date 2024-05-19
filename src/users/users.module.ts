import { Module } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
