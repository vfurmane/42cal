import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './basic.strategy.js';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, BasicStrategy],
})
export class AuthModule {}
