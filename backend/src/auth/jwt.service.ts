import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwtRefresh.strategy';

@Injectable()
export class JwtAuthService {
  constructor(private jwtService: JwtService) {}

  login(user) {
    const payload: JwtPayload = { login42: user.login42, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
