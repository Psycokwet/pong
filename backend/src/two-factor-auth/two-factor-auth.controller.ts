import { Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { ROUTES_BASE } from 'shared/routes';
import JwtRefreshGuard from 'src/auth/jwtRefresh.guard';
import { UsersService } from 'src/user/user.service';

@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class TwoFactorAuthController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtRefreshGuard)
  @Put(ROUTES_BASE.AUTH.TURN_ON_2FA)
  turn_on_2FA(@Req() req) {
    this.userService.set2fa(req.user.login42, true);
  }
  @Put(ROUTES_BASE.AUTH.TURN_OFF_2FA)
  @UseGuards(JwtRefreshGuard)
  turn_off_2FA(@Req() req) {
    this.userService.set2fa(req.user.login42, false);
  }
  @Get(ROUTES_BASE.AUTH.GET_2FA)
  @UseGuards(JwtRefreshGuard)
  async get_2FA(@Req() req) {
    const result = await this.userService.get2fa(req.user.login42);
    return result;
  }
}
