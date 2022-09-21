import { Controller, Get, Logger, Put, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from './requestWithUser.interface';
import JwtRefreshGuard from './jwtRefresh.guard';
import { ROUTES_BASE } from 'shared/routes';
import { UsersService } from 'src/user/user.service';

@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get(ROUTES_BASE.AUTH.REFRESH)
  refresh(@Req() request) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
  @UseGuards(JwtRefreshGuard)
  @Put(ROUTES_BASE.AUTH.TURN_ON_2FA)
  turn_on_2FA(@Req() req) {
    this.userService.set2fa(req.user.login42, true);
  }
  @Put(ROUTES_BASE.AUTH.TURN_OFF_2FA)
  @UseGuards(JwtRefreshGuard)
  turn_off_2FA(@Req() req: RequestWithUser) {
    this.userService.set2fa(req.user.login42, false);
  }
  @Get(ROUTES_BASE.AUTH.GET_2FA)
  @UseGuards(JwtRefreshGuard)
  async get_2FA(@Req() req: RequestWithUser) {
    const result = await this.userService.get2fa(req.user.login42);
    return result;
  }
}
