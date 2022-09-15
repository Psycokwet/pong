import {
  Controller,
  Logger,
  Get,
  Req,
  Res,
  UseGuards,
  Injectable,
  Redirect,
  Post,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoGuard } from 'src/auth/fortytwo.guard';
import { Profile } from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import RequestWithUser from './requestWithUser.interface';

@Injectable()
@Controller('auth/42')
export class FortyTwoController {
  private readonly logger = new Logger(FortyTwoController.name);
  
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(FortyTwoGuard)
  async fortyTwoAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(FortyTwoGuard)
  @Redirect('/', 302)
  async fortyTwoAuthRedirect(@Req() req: any, @Res() res: Response) {
    const {
      user,
      authInfo,
    }: {
      user: Profile;
      authInfo: {
        accessToken: string;
        refreshToken: string;
      };
    } = req.user;

        
    let userFromDb = await this.usersService.signin({ username: user.username });

    if (!userFromDb)
    {
      userFromDb = await this.usersService.signup({
        username: user.username,
        email: user.email,
      });
    }

    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(userFromDb.id);
    const refreshToken = this.authService.getJwtRefreshToken(userFromDb.id);
    const refreshTokenCookie = this.authService.getCookieWithJwtRefreshToken(refreshToken);
 
    await this.usersService.setCurrentRefreshToken(refreshToken, userFromDb.id);
 
    req.res.setHeader('Set-Cookie', [accessTokenCookie, refreshTokenCookie])
  }

  @UseGuards(JwtAuthGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(@Req() request: RequestWithUser) {
    await this.usersService.removeRefreshToken(request.user.id);
    request.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }
}