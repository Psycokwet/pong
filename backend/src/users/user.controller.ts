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
import { CreateUserDto } from './create-user.dto';
import { UsersService } from './users.service';

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
  //creer nouveau DTO GetUserHistoryDTO
  async get_user_history(@Body() user: CreateUserDto) {
    const userHistory = await this.usersService.get_user_history(user);  

    console.log(userHistory);
    if (!userHistory)
      return {};

    return {
      //userHistory,
      nbGames: userHistory.games.length,
      //nbWins: userHistory.games.filter(game => game.winner == userHistory.id).length
      nbWins: userHistory.games.filter( (game) => { return game.winner == userHistory.user.id} ).length, 
      nbLosses: userHistory.games.length - userHistory.games.filter( (game) => { return game.winner == userHistory.user.id} ).length,
      games: userHistory.games.map( (game) => { return {
        id: game.id,
        player1: game.player1.username,
        player2: game.player2.username,
        winner: game.winner === game.player1.id ? game.player1.username : game.player2.username
      } } )
    }
  }
}
