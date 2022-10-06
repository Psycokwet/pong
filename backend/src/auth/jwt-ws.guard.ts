import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { jwtConstants } from './constants';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtWsGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private jwtService: JwtService) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToWs().getClient();
    const authToken = req.handshake.headers.cookie
      .split('; ')
      .map((elem) => elem.split('='))
      .find((elem) => elem[0] === 'Authentication')[1];

    try {
      req.user = this.jwtService.verify(authToken, {
        secret: jwtConstants.JWT_ACCESS_TOKEN_SECRET,
      });
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`${e.name}: ${e.message} JE SUIS LA`);
      }
      return false;
    }
    return true;
  }
}

export const UserPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const jwtService = new JwtService();
    const authToken = ctx
      .switchToWs()
      .getClient()
      .handshake.headers.cookie.split('; ')
      .map((elem) => elem.split('='))
      .find((elem) => elem[0] === 'Authentication')[1];

    return jwtService.decode(authToken);
  },
);
