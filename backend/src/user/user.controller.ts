import {
  Body,
  Controller,
  Get,
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
import { UserInterface } from 'shared/interfaces/User';
import { User } from './user.entity';
import { GetUserProfileDto } from './get-user-profile.dto';

@Controller(ROUTES_BASE.USER.ENDPOINT)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(ROUTES_BASE.USER.GET_USER_PROFILE)
  @UseGuards(JwtAuthGuard)
  async getUserProfile(@Body() dto: GetUserProfileDto) {
    const profile = await this.usersService.findOneByPongUsername(
      dto.pongUsername,
    );

    return await this.usersService.getUserProfile(profile);
  }

  @Get(ROUTES_BASE.USER.GET_USER_RANK)
  @UseGuards(JwtAuthGuard)
  async getUserRank(@Request() req) {
    return await this.usersService.getUserRank(req.user);
  }

  @Get(ROUTES_BASE.USER.GET_USER_HISTORY)
  @UseGuards(JwtAuthGuard)
  async getUserHistory(@Request() req) {
    return await this.usersService.getUserHistory(req.user);
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
    return await this.usersService.setPongUsername(
      newPongUsername,
      req.user.login42,
    );
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
