import {
  Controller,
  Logger,
  Get,
  Req,
  UseGuards,
  Injectable,
  Redirect,
} from '@nestjs/common';
import { FortyTwoGuard } from 'src/auth/fortytwo.guard';
import { UsersService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import RequestWithUser from './requestWithUser.interface';
import JwtRefreshGuard from './jwtRefresh.guard';

import { ROUTES_BASE } from 'shared/httpsRoutes/routes';

@Injectable()
@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class FortyTwoController {
  private readonly logger = new Logger(FortyTwoController.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
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
    let userFromDb;
    try {
      userFromDb = await this.usersService.signin({
        login42: req.user.user.login42,
      });
    } catch (e) {
      userFromDb = await this.usersService.signup({
        login42: req.user.user.login42,
        email: req.user.user.email,
      });
    }

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      userFromDb.id,
    );
    const refreshToken = this.authService.getJwtRefreshToken(userFromDb.id);
    const refreshTokenCookie =
      this.authService.getCookieWithJwtRefreshToken(refreshToken);

    await this.usersService.setCurrentRefreshToken(refreshToken, userFromDb.id);

    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie]);
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
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
