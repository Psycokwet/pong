import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Game } from 'src/game/game.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { UserController } from './user.controller';
import { LocalFilesModule } from 'src/localFiles/localFiles.module';
import { LocalFilesService } from 'src/localFiles/localFiles.service';
import LocalFile from 'src/localFiles/localFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend, Game, LocalFile]),
    JwtModule,
    LocalFilesModule,
  ],
  controllers: [UserController],
  providers: [UsersService, LocalFilesService],
  exports: [UsersService, LocalFilesService],
})
export class UsersModule {}
