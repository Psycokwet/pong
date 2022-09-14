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
import { filter } from 'rxjs';
import { Game } from 'src/game/game.entity';
import { AddFriendDto } from './add-friend.dto';
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';
import { GetFriendsListDto } from './get-friends-list.dto';

@Controller('/user/')
export class UserController {
  private reqId = 1;

  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() user: CreateUserDto) {
    //not optimized, it to see a bit where we are on the logging, to change later or delete
    const reqId = this.reqId++;
    this.logger.log(`reqId no. ${reqId}: trying to create user`);
    await this.usersService.createUser(user);
  }

  @Get('get_user_rank')
  async get_user_rank(@Body() user: CreateUserDto) {
    const user_rank = await this.usersService.get_user_rank(user);
    
    return user_rank;
  }

  @Post('get_user_history')
  async get_user_history(@Body() user: CreateUserDto) {
    const userHistory = await this.usersService.get_user_history(user);  

    if (!userHistory)
      return {};

    /*  Manipulating userHistory array so we get exactly what we want */

    const nbGames = userHistory.games.length;
    const nbWins = userHistory.games.filter( (game) => { return game.winner == userHistory.user.id} ).length;
    return {
      nbGames,
      nbWins, 
      games: userHistory.games.map( (game) => { return {
        id: game.id,
        player1: game.player1.username,
        player2: game.player2.username,
        winner: game.winner === game.player1.id ? game.player1.username : game.player2.username
      } } )
    }
  }

  @Post('add_friend')
  async add_friend(@Body() friend: AddFriendDto) {
    await this.usersService.add_friend(friend);
  }

  // @Post('get_friends_list')
  // async get_friends_list(@Body() friend: GetFriendsListDto) {
  //   const friendList = await this.usersService.
  // }
}
