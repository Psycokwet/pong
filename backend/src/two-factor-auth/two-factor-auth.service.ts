import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';
import { toFileStream } from 'qrcode';
import { TWO_FACTOR_AUTHENTICATION_APP_NAME } from 'shared/other/basicConsts';

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly userService: UsersService) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      TWO_FACTOR_AUTHENTICATION_APP_NAME,
      secret,
    );
    await this.userService.setTwoFactorAuthenticationSecret(
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
}
