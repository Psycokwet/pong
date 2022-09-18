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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

import { createReadStream } from 'fs';
import { join } from 'path';
import { Express } from 'express';
import LocalFilesInterceptor from 'src/localFiles/localFiles.interceptor';
import { UserDto } from './user.dto';

@Controller('/user/')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('get_user_rank')
  async get_user_rank(@Body() user: Omit<UserDto, 'password'>) {
    const user_rank = await this.usersService.get_user_rank(user);

    return user_rank;
  }

  @Post('get_user_history')
  async get_user_history(@Body() user: Omit<UserDto, 'password'>) {
    const userHistory = await this.usersService.get_user_history(user);

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
          player1: game.player1.username,
          player2: game.player2.username,
          winner:
            game.winner === game.player1.id
              ? game.player1.username
              : game.player2.username,
          time: game.createdAt.toString().slice(0, 24),
        };
      }),
    };
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
