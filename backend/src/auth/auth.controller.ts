import { Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from './requestWithUser.interface';
import JwtRefreshGuard from './jwtRefresh.guard';
import { ROUTES_BASE } from 'shared/routes';

@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtRefreshGuard)
  @Get(ROUTES_BASE.AUTH.REFRESH)
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
  @UseGuards(JwtRefreshGuard)
  @Get(ROUTES_BASE.AUTH.TURN_ON_2FA)
  turn_on_2FA(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
  @Get(ROUTES_BASE.AUTH.TURN_OFF_2FA)
  turn_off_2FA(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
