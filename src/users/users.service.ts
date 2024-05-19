import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AUTH_BASIC_PASSWORD, AUTH_BASIC_USERNAME } from '../common/constants/auth-config.js';

@Injectable()
export class UsersService {
  private readonly basicUsername: string;
  private readonly basicPassword: string;

  constructor(private readonly configService: ConfigService) {
    this.basicUsername = this.configService.getOrThrow(AUTH_BASIC_USERNAME);
    this.basicPassword = this.configService.getOrThrow(AUTH_BASIC_PASSWORD);
  }

  getBasicUser() {
    return {
      username: this.basicUsername,
      password: this.basicPassword,
    };
  }
}
