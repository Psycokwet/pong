import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/game.entity';
import { User } from 'src/users/user.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { Game } from 'src/game/game.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { JwtAuthModule } from './jwt.module';

@Module({
<<<<<<< HEAD
  imports: [
    JwtAuthModule,
    UsersModule,
    TypeOrmModule.forFeature([User, Game, Friend]),
  ],
=======
  imports: [JwtAuthModule, UsersModule, TypeOrmModule.forFeature([User, Game])],
>>>>>>> nad_route_backend
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy, UsersService, AuthService],
})
export class FortyTwoModule {}
