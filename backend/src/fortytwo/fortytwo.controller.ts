import {
  Controller,
  Logger,
  Get,
  Req,
  UseGuards,
  Injectable,
  Redirect,
} from '@nestjs/common';
import { UsersService } from 'src/user/user.service';

import { ROUTES_BASE } from 'shared/httpsRoutes/routes';
import { FortyTwoGuard } from './fortytwo.guard';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import JwtRefreshGuard from 'src/auth/jwtRefresh.guard';
import { FortytwoService } from './fortytwo.service';
import { User } from 'src/user/user.entity';
import { TwoFactorAuthService } from 'src/two-factor-auth/two-factor-auth.service';

@Injectable()
@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class FortyTwoController {
  private readonly logger = new Logger(FortyTwoController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly fortyTwoService: FortytwoService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @Get()
  @UseGuards(FortyTwoGuard)
  async fortyTwoAuth(@Req() _req) {
    // Guard redirects
  }

  @Get(ROUTES_BASE.AUTH.REDIRECT)
  @UseGuards(FortyTwoGuard)
  @Redirect('/', 302)
  async fortyTwoAuthRedirect(@Req() req: any) {
    let user: User = await this.fortyTwoService.getSignedInUser(
      req.user.user.login42,
      req.user.user.email,
    );

    if (!user) {
      //manage two step signup
      return;
    }

    req.res.setHeader(
      'Set-Cookie',
      await this.twoFactorAuthService.getCookiesWith2FAValue(user, false),
    );
  }

  @Get(ROUTES_BASE.AUTH.LOGOUT)
  @UseGuards(JwtAuthGuard)
  @Redirect('/', 302)
  async logout(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @UseGuards(JwtRefreshGuard)
  @Get(ROUTES_BASE.AUTH.REFRESH)
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
      false,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
