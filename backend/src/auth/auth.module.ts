import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthStrategy } from './jwt.strategy';
import { JwtWsGuard } from './jwt-ws.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule,
  ],
  providers: [AuthService, JwtAuthStrategy /*JwtWebsocketStrategy*/, JwtWsGuard],
  exports: [AuthService, JwtWsGuard],
})
export class AuthModule {}
