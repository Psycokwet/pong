
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtConstants } from './jwtConstants';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: JwtConstants.secret,
          signOptions: {
            expiresIn: JwtConstants.expiresIn
          },
        };
      },
      inject: [],
    }),
  ],
  providers: [JwtStrategy, JwtAuthService],
  exports: [JwtModule, JwtAuthService],
})
export class JwtAuthModule {}