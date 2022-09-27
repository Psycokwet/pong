import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { UsersModule } from 'src/user/user.module';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { JwtAuthModule } from 'src/auth/jwt.module';
import { AuthModule } from 'src/auth/auth.module';
import { FortytwoService } from './fortytwo.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Game, Friend]),
    JwtAuthModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy, FortytwoService],
})
export class FortyTwoModule {}
