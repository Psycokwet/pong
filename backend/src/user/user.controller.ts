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
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { AddFriendDto } from './add-friend.dto';
import { pongUsernameDto } from './set-pongusername.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Express } from 'express';
import LocalFilesInterceptor from 'src/localFiles/localFiles.interceptor';
import { ROUTES_BASE } from 'shared/httpsRoutes/routes';
import { PlayGameDto } from './play-game.dto';
import { User } from './user.entity';

@Controller(ROUTES_BASE.USER.ENDPOINT)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(ROUTES_BASE.USER.GET_USER_RANK)
  @UseGuards(JwtAuthGuard)
  async getUserRank(@Request() req) {
    const user_rank = await this.usersService.getUserRank(req.user.login42);

    return user_rank;
  }

  @Get(ROUTES_BASE.USER.GET_USER_HISTORY)
  @UseGuards(JwtAuthGuard)
  async getUserHistory(@Request() req) {
    const userHistory = await this.usersService.getUserHistory(
      req.user.login42,
    );

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
                ? this.usersService.getFrontUsername(game.player2)
                : this.usersService.getFrontUsername(game.player1),
            winner:
              game.winner === game.player1.id
                ? this.usersService.getFrontUsername(game.player1)
                : this.usersService.getFrontUsername(game.player2),
            id: game.id,
          };
        })
        .sort((a, b) => b.id - a.id),
    };
  }

  @Post(ROUTES_BASE.USER.PLAY_GAME)
  @UseGuards(JwtAuthGuard)
  async playGame(@Body() dto: PlayGameDto) {
    await this.usersService.playGame(dto);
  }

  @Post(ROUTES_BASE.USER.ADD_FRIEND)
  @UseGuards(JwtAuthGuard)
  async addFriend(@Body() dto: AddFriendDto, @Request() req) {
    const friend = await this.usersService.findOneByPongUsername(
      dto.friend_to_add,
    );
    await this.usersService.addFriend(friend, req.user);
  }

  @Get(ROUTES_BASE.USER.GET_FRIEND_LIST)
  @UseGuards(JwtAuthGuard)
  async getFriendsList(@Request() req) {
    return await this.usersService.getFriendsList(req.user);
  }

  @Get(ROUTES_BASE.USER.GET_LOGIN42)
  @UseGuards(JwtAuthGuard)
  async getLogin42(@Request() req) {
    return await this.usersService.getLogin42(req.user.login42);
  }

  @Get(ROUTES_BASE.USER.GET_NICKNAME)
  @UseGuards(JwtAuthGuard)
  async getPongUsername(@Request() req) {
    return await this.usersService.getPongUsername(req.user.login42);
  }

  @Post(ROUTES_BASE.USER.SET_NICKNAME)
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
