import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
  UseGuards,
  StreamableFile,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './user.service';

import { createReadStream } from 'fs';
import { join } from 'path';
import { Express } from 'express';
import LocalFilesInterceptor from 'src/localFiles/localFiles.interceptor';
import { UserDto } from './user.dto';
import { PlayGameDto } from './play-game.dto';
import { AddFriendDto } from './add-friend.dto';
import { GetFriendsListDto } from './get-friends-list.dto';
import { SetUsernameDto } from './set-username.dto';

@Controller('/user/')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('get_user_rank')
  //@UseGuards(JwtAuthGuard)
  async get_user_rank(@Body() user: Omit<UserDto, 'password'>) {
    const user_rank = await this.usersService.get_user_rank(user);

    return user_rank;
  }

  @Post('get_user_history')
  //@UseGuards(JwtAuthGuard)
  async get_user_history(@Body() user: Omit<UserDto, 'password'>) {
    const userHistory = await this.usersService.get_user_history(user);

    if (!userHistory) return {};

    /*  Manipulating userHistory array so we get exactly what we want.
        The sort ensures the latest games are returned first. */

    const nbGames = userHistory.games.length;
    const nbWins = userHistory.games.filter((game) => {
      return game.winner == userHistory.user.id;
    }).length;
    return {
      nbGames,
      nbWins,
      games: userHistory.games
        .map((game) => {
          return {
            time: game.createdAt.toString().slice(4, 24),
            opponent:
              game.player1.id === userHistory.user.id
                ? game.player2.username
                : game.player1.username,
            winner:
              game.winner === game.player1.id
                ? game.player1.username
                : game.player2.username,
            id: game.id,
          };
        })
        .sort((a, b) => b.id - a.id),
    };
  }

  @Post('play_game')
  //@UseGuards(JwtAuthGuard)
  async play_game(@Body() dto: PlayGameDto) {
    await this.usersService.play_game(dto);
  }

  @Post('add_friend')
  //@UseGuards(JwtAuthGuard)
  async add_friend(@Body() friend: AddFriendDto) {
    await this.usersService.add_friend(friend);
  }

  @Get('get_friends_list')
  //@UseGuards(JwtAuthGuard)
  async get_friends_list(@Body() friend: GetFriendsListDto) {
    const friendList = await this.usersService.get_friends_list(friend);

    return friendList.map((friend) => {
      return {
        username: friend.user.username,
      };
    });
  }

  @Get('get_username')
  //@UseGuards(JwtAuthGuard)
  async get_username(@Body() user: UserDto) {
    return await this.usersService.get_username(user);
  }

  @Post('set_username')
  //@UseGuards(JwtAuthGuard)
  async set_username(@Body() user: SetUsernameDto) {
    await this.usersService.set_username(user);
  }
  @Get('get_picture')
  @UseGuards(JwtAuthGuard)
  async get_picture(@Request() req): Promise<StreamableFile> {
    const picture_path = await this.usersService.get_picture(req.user);

    // https://docs.nestjs.com/techniques/streaming-files
    const file = createReadStream(join(process.cwd(), `${picture_path}`));
    return new StreamableFile(file);
  }

  @Post('set_picture')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/avatars',
    }),
  )
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.set_picture(req.user, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }
}
