import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class FortytwoService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async set2fa(login42: string, value: boolean) {
    const user = await this.usersService.findOne(login42);

    /* We use TypeORM's update function to update our entity */
    await this.usersService.set2fa(user, value);

    return await this.getCookiesWith2FAValue(user, value);
  }
  public async getSignedInUser(login42: string, email: string) {
    let user: User = null;
    try {
      user = await this.usersService.signin({
        login42,
      });
    } catch (e) {
      //will have to manage signup more ... Slowly, like, in multiple steps, to fit requirements
      user = await this.usersService.signup({
        login42,
        email,
      });
    }
    return user;
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
}
