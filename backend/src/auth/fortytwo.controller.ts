import { Controller, Logger, Get, Req, Res, UseGuards, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import { FortyTwoGuard } from 'src/auth/fortytwo.guard';
import { JwtAuthService } from './jwt.service';
import { Profile } from 'passport-42';

@Injectable()
@Controller('auth/42')
export class FortyTwoController {
  private readonly logger = new Logger(FortyTwoController.name);
  private reqId = 1;
  
  constructor(private JwtAuthService: JwtAuthService) {}

  @Get()
  @UseGuards(FortyTwoGuard)
  async fortyTwoAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(FortyTwoGuard)
  async fortyTwoAuthRedirect(@Req() req: any, @Res() res: Response) {
    // console.log(req.user);
    // this.logger.log(`Create JWT for user ${req.user.username}`);

    // // // TODO generate a crypted key
    // const payload = { username: req.user.username, sub: req.user.userId };
    // console.log('Create bearer');
    // return {
    //   access_token: this.JwtAuthService.login(payload),
    // }
    const {
      user,
      authInfo,
    }: {
      user: Profile;
      authInfo: {
        accessToken: string;
        refreshToken: string;
        expires_in: number;
      };
    } = req;

    if (!user) {
      res.redirect('/');
      return;
    }
      
    req.user = undefined;

    const jwt = this.JwtAuthService.login(user).accessToken;

    res.set('authorization', `Bearer ${jwt}`);

    return res.status(201).json({ authInfo, user });
  }
}