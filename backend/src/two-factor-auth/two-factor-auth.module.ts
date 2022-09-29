import { Module } from '@nestjs/common';
import { UsersModule } from 'src/user/user.module';
import { TwoFactorAuthController } from './two-factor-auth.controller';
import { TwoFactorAuthService } from './two-factor-auth.service';

@Module({
  imports: [UsersModule],
  controllers: [TwoFactorAuthController],
  providers: [TwoFactorAuthService],
})
export class TwoFactorAuthModule {}
