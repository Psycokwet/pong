import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
<<<<<<< HEAD
import { jwtConstants } from 'src/auth/constants';
import { Game } from 'src/game/game.entity';
import { Friend } from 'src/friend_list/friend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Friend]), 
  JwtModule.registerAsync({
    useFactory: async () => {
      return {
        secret: jwtConstants.secret,
        signOptions: { expiresIn: '60s' },
      };
    },
    inject: [],
  }),
=======

@Module({
  imports: [TypeOrmModule.forFeature([User]), 
  JwtModule,
>>>>>>> main
],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}