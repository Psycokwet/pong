import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';
import { TwoFactorAuthStrategy } from './two-factor-auth.strategy';

@Module({
  imports: [UsersModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService, TwoFactorAuthStrategy],
})
export class TwoFactorAuthModule {}
