import { Module } from '@nestjs/common';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { JwtAuthModule } from './jwt.module';

@Module({
  imports: [JwtAuthModule],
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy],
})
export class FortyTwoModule {}