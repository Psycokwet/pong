import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/auth/constants';
import { Game } from 'src/game/game.entity';
import { Friend } from 'src/friend_list/friend_list.entity';

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
],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}