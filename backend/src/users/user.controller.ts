import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
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
}
