import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';
import { toFileStream } from 'qrcode';

@Injectable()
export class TwoFactorAuthService {
  constructor(private readonly userService: UsersService) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.email,
      process.env.UPLOADED_FILES_DESTINATION,
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
}
