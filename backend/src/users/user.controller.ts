import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  Request,
} from '@nestjs/common';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';

@Controller('/user/')
export class UserController {
  private reqId = 1;
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup (@Body() dto: UserDto) { // dto: data transfert object
    const reqId = this.reqId++;
    this.logger.log(`reqId no. ${reqId}: trying to create user`);

    return await this.usersService.signup(dto);
  }

  @Post('signin')
  async signin (@Body() dto: UserDto) {
    return this.usersService.signin(dto);
  }

  // @Post('signout')
  // async signout (@Body() dto: UserDto) {
  //   return this.usersService.signout(dto);
  // }
}
