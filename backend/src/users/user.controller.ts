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
} from '@nestjs/common';
import { Game } from 'src/game/game.entity';
import { AddFriendDto } from './add-friend.dto';
import { SetUsernameDto } from './set-username.dto';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';
import { GetFriendsListDto } from './get-friends-list.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('/user/')
export class UserController {
  private reqId = 1;

  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get('get_user_rank')
  @UseGuards(JwtAuthGuard)
  async get_user_rank(@Body() user: Omit<UserDto, 'password'>) {
    const user_rank = await this.usersService.get_user_rank(user);

    return user_rank;
  }

  @Post('get_user_history')
  @UseGuards(JwtAuthGuard)
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

  @Post('add_friend')
  @UseGuards(JwtAuthGuard)
  async add_friend(@Body() friend: AddFriendDto) {
    await this.usersService.add_friend(friend);
  }

  @Get('get_friends_list')
  @UseGuards(JwtAuthGuard)
  async get_friends_list(@Body() friend: GetFriendsListDto) {
    const friendList = await this.usersService.get_friends_list(friend);

    return friendList.map((friend) => {
      return {
        username: friend.user.username,
      };
    });
  }

  @Get('get_username')
  @UseGuards(JwtAuthGuard)
  async get_username(@Body() user: UserDto) {
    return await this.usersService.get_username(user);
  }

  @Post('set_username')
  @UseGuards(JwtAuthGuard)
  async set_username(@Body() user: SetUsernameDto) {
    await this.usersService.set_username(user);
  }
}
