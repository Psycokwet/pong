import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/user/user.module';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthStrategy } from './two-factor-auth.strategy';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, TwoFactorAuthStrategy],
  exports: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
