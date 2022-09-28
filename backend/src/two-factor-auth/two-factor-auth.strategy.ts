import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { jwtConstants } from 'src/auth/constants';
import { UsersService } from 'src/user/user.service';
import { TokenPayload } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';

@Injectable()
export class TwoFactorAuthStrategy extends PassportStrategy(
  Strategy,
  'jwt_two_factor',
) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Refresh;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.JWT_REFRESH_TOKEN_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(request: Request, payload: TokenPayload) {
    const user: User = await this.userService.getById(payload.userId);
    if (
      !user.isTwoFactorAuthenticationActivated ||
      payload.is2FAAuthenticated
    ) {
      const refreshToken = request.cookies?.Refresh;
      return this.userService.getUserIfRefreshTokenMatches(
        refreshToken,
        payload.userId,
      );
    }
  }
}
