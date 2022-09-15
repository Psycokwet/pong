import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { compareCryptedPassword } from '../utils';
import { AuthUserIdDto } from './auth-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private reqId = 1;

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // validateUser looks to the service to find the appropriate user and return
  // its username and its id. Returns null if the user is not found.
  async validateUser(
    username: string,
    pass: string,
  ): Promise<{ userId: number; username: string } | undefined> {
    const reqId = this.reqId++;
    this.logger.log(`req no. ${reqId}: Trying to find user ${username}`);
    const user: User | undefined = await this.userService.findOne(username);
    if (user && compareCryptedPassword(pass, user.password)) {
      this.logger.log(`${reqId} user found`);
      const { id, username } = user;
      return { userId: id, username: username };
    }
    this.logger.log(`req no. ${reqId}: user not found`);
    return null;
  }

  // login returns a JWT to the user
  async login(user: AuthUserIdDto) {
    this.logger.log(`Create JWT for user ${user.username}`);

    // TODO generate a crypted key
    const payload = { username: user.username, sub: user.userId };
    console.log('Create bearer');
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
