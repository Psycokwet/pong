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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserDto } from './user.dto';
import { UsersService } from './users.service';
import { AuthUserIdDto } from 'src/auth/auth-user.dto';

import { createReadStream } from 'fs';
import { join } from 'path';
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
    return await this.usersService.signin(dto);
  }

  @Post('signout')
  async signout (@Body() dto: UserDto) {
    return this.usersService.signout();
  }

  @Get('get_picture')
  @UseGuards(JwtAuthGuard)
  async get_picture(@Request() req: { user: AuthUserIdDto }): Promise<StreamableFile> {
    const picture_path = await this.usersService.get_picture(req.user);
    const picture_folder = "pictures";

    // https://docs.nestjs.com/techniques/streaming-files
    const file = createReadStream(join(process.cwd(), `${picture_folder}/${picture_path}`));
    return new StreamableFile(file);
  }
}
