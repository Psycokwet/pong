import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtAuthStrategy } from './jwt.strategy';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { JwtRefreshStrategy } from './jwtRefresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: jwtConstants.JWT_ACCESS_TOKEN_SECRET,
          signOptions: { expiresIn: '60s' },
        };
      },
      inject: [],
    }),
  ],
  providers: [JwtAuthStrategy, JwtAuthService, JwtRefreshStrategy],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}
