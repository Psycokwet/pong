import {
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ROUTES_BASE } from 'shared/httpsRoutes/routes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import JwtRefreshGuard from 'src/auth/jwtRefresh.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { UsersService } from 'src/user/user.service';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class TwoFactorAuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

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
  @Post(ROUTES_BASE.AUTH.GENERATE_2FA)
  @UseGuards(JwtAuthGuard)
  async generate_2FA(
    @Res() response: Response,
    @Req() request: RequestWithUser,
  ) {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        request.user,
      );
    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  }
}
