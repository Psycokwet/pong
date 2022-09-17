import { Body, Controller, Get, Logger, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import RequestWithUser from './requestWithUser.interface';
import JwtRefreshGuard from './jwtRefresh.guard';
import { UserDto } from 'src/user/user.dto';
import { UsersService } from 'src/user/user.service';
@Controller('/auth/')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() request: RequestWithUser) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      request.user.id,
    );

    request.res.setHeader('Set-Cookie', accessTokenCookie);
    return request.user;
  }
}
