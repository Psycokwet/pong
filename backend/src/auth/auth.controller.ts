import { Controller, Get, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import JwtRefreshGuard from './jwtRefresh.guard';
import { ROUTES_BASE } from 'shared/routes';

@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtRefreshGuard)
  @Get(ROUTES_BASE.AUTH.REFRESH)
  refresh(@Req() request) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
