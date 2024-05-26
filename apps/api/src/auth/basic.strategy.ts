import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service.js';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as _BasicStrategy } from 'passport-http';

@Injectable()
export class BasicStrategy extends PassportStrategy(_BasicStrategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(username: string, password: string) {
    const user = this.authService.validateUser(username, password);
    if (user === null) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
