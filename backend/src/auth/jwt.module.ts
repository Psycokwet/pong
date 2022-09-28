import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtAuthStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/user/user.module';
import { JwtRefreshStrategy } from './jwtRefresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule,
  ],
  providers: [JwtAuthStrategy, JwtAuthService, JwtRefreshStrategy],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
