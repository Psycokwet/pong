import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './local.strategy';
import { jwtConstants } from './constants';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { WsGuard } from './jwt-ws.guard';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoModule } from './fortytwo.module';
// import { JwtWebsocketStrategy } from './jwt.websocket.strategy';

@Module({
  imports: [
    FortyTwoModule,
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy /*JwtWebsocketStrategy*/,
    WsGuard,
  ],
  exports: [AuthService, WsGuard],
})
export class AuthModule {}
