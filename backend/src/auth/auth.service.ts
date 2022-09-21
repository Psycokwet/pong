import { Injectable, Logger } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/user.entity';
import { jwtConstants } from './constants';
export interface TokenPayload {
  userId: number;
}
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private reqId = 1;

  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // validateUser looks to the service to find the appropriate user and return
  // its login42 and its id. Returns null if the user is not found.
  async validateUser(
    login42: string,
  ): Promise<{ userId: number; login42: string } | undefined> {
    const reqId = this.reqId++;
    this.logger.log(`req no. ${reqId}: Trying to find user ${login42}`);
    const user: User | undefined = await this.userService.findOne(login42);
    this.logger.log(`${reqId} user found`);
    return { userId: user.id, login42: login42 };
  }

  public getCookieWithJwtAccessToken(userId: number) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: jwtConstants.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: jwtConstants.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.JWT_ACCESS_TOKEN_EXPIRATION_TIME}`;
  }

  public getJwtRefreshToken(userId: number) {
    const payload: TokenPayload = { userId };
    return this.jwtService.sign(payload, {
      secret: jwtConstants.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: jwtConstants.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
  }

  public getCookieWithJwtRefreshToken(token: string) {
    return `Refresh=${token}; HttpOnly; Path=/; Max-Age=${jwtConstants.JWT_REFRESH_TOKEN_EXPIRATION_TIME}`;
  }

  public getCookiesForLogOut() {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0',
    ];
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token, {
      secret: jwtConstants.JWT_ACCESS_TOKEN_SECRET,
    });
    if (payload.userId) {
      return this.userService.getById(payload.userId);
    }
  }
}
