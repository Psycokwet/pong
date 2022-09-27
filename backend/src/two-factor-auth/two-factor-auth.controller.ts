import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ROUTES_BASE } from 'shared/httpsRoutes/routes';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import JwtRefreshGuard from 'src/auth/jwtRefresh.guard';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { FortytwoService } from 'src/fortytwo/fortytwo.service';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Controller(ROUTES_BASE.AUTH.ENDPOINT)
export class TwoFactorAuthController {
  constructor(
    private readonly userService: UsersService,
    private readonly twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @UseGuards(JwtRefreshGuard)
  @Post(ROUTES_BASE.AUTH.TURN_ON_2FA) // to use after generate, with the code
  async turn_on_2FA(
    @Req() { user }: RequestWithUser,
    @Res() response,
    @Body() { code }: TwoFactorAuthCodeDto,
  ) {
    console.log('Ah que cc bob');
    const isValid = await this.twoFactorAuthService.is2FACodeValid(code, user);
    if (!isValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }

    response.setHeader(
      'Set-Cookie',
      await this.twoFactorAuthService.set2fa(user.login42, true),
    );
    console.log('Ah que bubye bob');
  }
  @Put(ROUTES_BASE.AUTH.TURN_OFF_2FA)
  @UseGuards(JwtRefreshGuard)
  async turn_off_2FA(@Req() { user }: RequestWithUser, @Res() response) {
    response.setHeader(
      'Set-Cookie',
      await this.twoFactorAuthService.set2fa(user.login42, false),
    );
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
    request.res.setHeader(
      'Set-Cookie',
      await this.twoFactorAuthService.set2fa(request.user.login42, false),
    );
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        request.user,
      );
    return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  }

  // @Post(ROUTES_BASE.AUTH.CHECK_2FA)
  // @UseGuards(JwtAuthGuard)
  // async check_2FA(
  //   @Res() response: Response,
  //   @Req() request: RequestWithUser,
  // ) {
  //   const { otpauthUrl } =
  //     await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
  //       request.user,
  //     );
  //   return this.twoFactorAuthService.pipeQrCodeStream(response, otpauthUrl);
  // }
}
