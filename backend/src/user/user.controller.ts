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
  Param,
  BadRequestException,
  Query,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { pongUsernameDto } from './set-pongusername.dto';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Express } from 'express';
import LocalFilesInterceptor from 'src/localFiles/localFiles.interceptor';
import { ROUTES_BASE } from 'shared/httpsRoutes/routes';
import { TwoFactorAuthGuard } from 'src/two-factor-auth/two-factor-auth.guard';
import { User } from './user.entity';
import RequestWithUser from 'src/auth/requestWithUser.interface';
import { AddFriendDto } from './add-friend.dto';

@Controller(ROUTES_BASE.USER.ENDPOINT)
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(ROUTES_BASE.USER.GET_USER_PROFILE)
  @UseGuards(JwtAuthGuard)
  async getUserProfile(
    @Request() req: RequestWithUser,
    @Query() query: { pongUsername: string },
  ) {
    let user: User = null;
    if (!query.pongUsername)
      user = await this.usersService.findOne(req.user.login42);
    else
      user = await this.usersService.findOneByPongUsername(query.pongUsername);
    if (!user) {
      throw new BadRequestException({ error: 'User not found' });
    }
    return await this.usersService.getUserProfile(user);
  }

  @Get(ROUTES_BASE.USER.GET_USER_RANK)
  @UseGuards(TwoFactorAuthGuard)
  async getUserRank(@Request() req) {
    return await this.usersService.getUserRank(req.user);
  }

  @Get(ROUTES_BASE.USER.GET_USER_HISTORY)
  @UseGuards(TwoFactorAuthGuard)
  async getUserHistory(@Request() req) {
    return await this.usersService.getUserHistory(req.user);
  }

  @Get(ROUTES_BASE.USER.GET_LOGIN42)
  @UseGuards(TwoFactorAuthGuard)
  async getLogin42(@Request() req) {
    return await this.usersService.getLogin42(req.user.login42);
  }

  @Get(ROUTES_BASE.USER.GET_PONG_USERNAME)
  @UseGuards(TwoFactorAuthGuard)
  async getPongUsername(@Request() req) {
    return await this.usersService.getPongUsername(req.user.login42);
  }

  @Post(ROUTES_BASE.USER.SET_PONG_USERNAME)
  @UseGuards(TwoFactorAuthGuard)
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
  @UseGuards(TwoFactorAuthGuard)
  async getPicture(
    @Request() req: RequestWithUser,
    @Query() query: { pongUsername: string },
  ): Promise<StreamableFile> {
    let user: User = null;
    console.log(req);
    if (!query.pongUsername)
      user = await this.usersService.findOne(req.user.login42);
    else
      user = await this.usersService.findOneByPongUsername(query.pongUsername);
    if (!user) {
      throw new BadRequestException({ error: 'User not found' });
    }
    const picture_path = await this.usersService.getPicture(user);

    // https://docs.nestjs.com/techniques/streaming-files
    const file = createReadStream(join(process.cwd(), `${picture_path}`));
    return new StreamableFile(file);
  }

  @Post(ROUTES_BASE.USER.SET_PICTURE)
  @UseGuards(TwoFactorAuthGuard)
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
