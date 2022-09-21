import {
  Controller,
  Get,
  Logger,
  Post,
  Request,
  UseGuards,
  StreamableFile,
  UseInterceptors,
  UploadedFile,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { Game } from 'src/game/game.entity';
import { UserDto } from './user.dto';
import { UsersService } from './user.service';
import { GetFriendsListDto } from './get-friends-list.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddFriendDto } from './add-friend.dto';
import { pongUsernameDto } from './set-pongusername.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Express } from 'express';
import LocalFilesInterceptor from 'src/localFiles/localFiles.interceptor';
import { ROUTES_BASE } from 'shared/routes';

@Controller(ROUTES_BASE.USER.ENDPOINT)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(ROUTES_BASE.USER.GET_USER_RANK)
  @UseGuards(JwtAuthGuard)
  async getUserRank(@Body() user: Omit<UserDto, 'password'>) {
    const user_rank = await this.usersService.getUserRank(user);

    return user_rank;
  }

  @Post(ROUTES_BASE.USER.GET_USER_HISTORY)
  @UseGuards(JwtAuthGuard)
  async getUserHistory(@Body() user: Omit<UserDto, 'password'>) {
    const userHistory = await this.usersService.getUserHistory(user);

    if (!userHistory) return {};

    /*  Manipulating userHistory array so we get exactly what we want */

    const nbGames = userHistory.games.length;
    const nbWins = userHistory.games.filter((game) => {
      return game.winner == userHistory.user.id;
    }).length;
    return {
      nbGames,
      nbWins,
      games: userHistory.games.map((game) => {
        return {
          id: game.id,
          player1: this.usersService.getFrontUsername(game.player1),
          player2: this.usersService.getFrontUsername(game.player2),
          winner:
            game.winner === game.player1.id
              ? this.usersService.getFrontUsername(game.player1)
              : this.usersService.getFrontUsername(game.player2),
        };
      }),
    };
  }

  @Post(ROUTES_BASE.USER.ADD_FRIEND)//'add_friend')
  @UseGuards(JwtAuthGuard)
  async addFriend(@Body() friend: AddFriendDto, @Request() req) {
    await this.usersService.addFriend(friend, req.user.login42);
  }

  @Get(ROUTES_BASE.USER.GET_FRIEND_LIST)//'get_friends_list')
  @UseGuards(JwtAuthGuard)
  async getFriendsList(@Request() req) {
    const friendList = await this.usersService.getFriendsList(req.user.login42);

    return friendList.map((friend) => {
      return {
        login42: this.usersService.getFrontUsername(friend.user),
      };
    });
  }

  @Get(ROUTES_BASE.USER.GET_NICKNAME)//'get_pong_username')
  @UseGuards(JwtAuthGuard)
  async getPongUsername(@Request() req) {
    return await this.usersService.getPongUsername(req.user.login42);
  }

  @Post(ROUTES_BASE.USER.SET_NICKNAME)//'set_pong_username')
  @UseGuards(JwtAuthGuard)
  async setPongUsername(
    @Body() newPongUsername: pongUsernameDto,
    @Request() req,
  ) {
    await this.usersService.setPongUsername(newPongUsername, req.user.login42);
  }
  @Get(ROUTES_BASE.USER.GET_PICTURE)
  @UseGuards(JwtAuthGuard)
  async getPicture(@Request() req): Promise<StreamableFile> {
    const picture_path = await this.usersService.getPicture(req.user);

    // https://docs.nestjs.com/techniques/streaming-files
    const file = createReadStream(join(process.cwd(), `${picture_path}`));
    return new StreamableFile(file);
  }

  @Post(ROUTES_BASE.USER.SET_PICTURE)
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/avatars',
    }),
  )
  async uploadFile(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.usersService.setPicture(req.user, {
      path: file.path,
      filename: file.originalname,
      mimetype: file.mimetype,
    });
  }
}
