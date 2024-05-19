import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  validateUser(username: string, password: string) {
    const user = this.usersService.getBasicUser();
    if (username === user.username && password === user.password) {
      return {};
    } else {
      return null;
    }
  }
}
