import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class WsGuard extends AuthGuard('jwt') {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToWs().getClient();
    const bearerToken = req.handshake.headers.authorization;
    try {
      req.user = this.jwtService.verify(bearerToken, {
        secret: jwtConstants.JWT_ACCESS_TOKEN_SECRET,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`${e.name}: ${e.message}`);
      }
      return false;
    }
    return true;
  }
}

export const UserPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // console.log('data:', data);
    const request = ctx.switchToWs().getClient();
    return request.user;
  },
);

export const DataPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    return ctx.switchToWs().getData();
  },
);
