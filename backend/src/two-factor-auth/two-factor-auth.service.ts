import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';
import { toFileStream } from 'qrcode';
import { TWO_FACTOR_AUTHENTICATION_APP_NAME } from 'shared/other/basicConsts';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );
    await this.usersService.setTwoFactorAuthenticationSecret(
      secret,
      user.login42,
    );
    return { secret, otpauthUrl };
  }
  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }
  public async is2FACodeValid(code: string, user: User) {
    return authenticator.verify({
      token: code,
      secret: user.twoFactorAuthenticationSecret,
    });
  }

  async set2fa(login42: string, value: boolean) {
    const user = await this.usersService.findOne(login42);

    /* We use TypeORM's update function to update our entity */
    await this.usersService.set2fa(user, value);

    return await this.getCookiesWith2FAValue(user, value);
  }
  public async getCookiesWith2FAValue(user: User, is2FAAuthenticated: boolean) {
    const accessTokenCookie = this.authService.getCookieWithJwtAccessToken(
      user.id,
      is2FAAuthenticated,
    );
    const refreshToken = this.authService.getJwtRefreshToken(
      user.id,
      is2FAAuthenticated,
    );
    const refreshTokenCookie =
      this.authService.getCookieWithJwtRefreshToken(refreshToken);

    await this.usersService.setCurrentRefreshToken(refreshToken, user.id);

    return [accessTokenCookie, refreshTokenCookie];
  }

  public async updateCookiesWithValid2FA(userId: number, user: User) {}
}
