import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { User } from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';

@Injectable()
export class FortytwoService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

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
}
