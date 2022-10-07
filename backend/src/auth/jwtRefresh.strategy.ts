import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { TokenPayload } from './auth.service';
import { UsersService } from '../user/user.service';
import { Request } from 'express';
import { User } from 'src/user/user.entity';
import { CurrentUser } from 'src/user/CurrentUser';

//is it still in use ?
export type JwtPayload = { sub: number; login42: string };

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
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
    const refreshToken = request.cookies?.Refresh;
    const user: User = await this.userService.getUserIfRefreshTokenMatches(
      refreshToken,
      payload.userId,
    );
    if (!user) return;
    let result: CurrentUser = {
      ...user,
      status: this.userService.getStatusFromUser(user, payload),
      isTwoFactorAuthenticated: payload.isTwoFactorAuthenticated,
    } as CurrentUser;
    return result;
  }
}
