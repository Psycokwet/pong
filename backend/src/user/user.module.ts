import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Game } from 'src/game/game.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { UserController } from './user.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Friend, Game]), JwtModule],
  controllers: [UserController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
