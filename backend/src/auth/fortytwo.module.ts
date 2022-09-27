import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { UsersModule } from 'src/user/user.module';
import { FortyTwoController } from './fortytwo.controller';
import { JwtAuthModule } from './jwt.module';
import { AuthModule } from './auth.module';
import { FortyTwoStrategy } from './fortytwo.strategy';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    JwtAuthModule,
    TypeOrmModule.forFeature([User, Game, Friend]),
  ],
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy],
  exports: [FortyTwoStrategy],
})
export class FortyTwoModule {}
