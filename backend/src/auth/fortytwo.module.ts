import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/game.entity';
import { User } from 'src/user/user.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { UsersModule } from 'src/user/user.module';
import { UsersService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { JwtAuthModule } from './jwt.module';

@Module({
  imports: [
    JwtAuthModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Game, Friend]),
  ],
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy, UsersService, AuthService],
})
export class FortyTwoModule {}
