import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import { Game } from 'src/game/game.entity';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('/user/')
export class UserController {
  private reqId = 1;

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
        };
      }),
    };
  }
}
