import { Controller, Logger, Get, Req, Res, UseGuards, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { FortyTwoGuard } from 'src/auth/fortytwo.guard';
import { JwtAuthService } from './jwt.service';
import { Profile } from 'passport-42';

@Injectable()
@Controller('auth/42')
export class FortyTwoController {
  private readonly logger = new Logger(FortyTwoController.name);
  
  constructor(private JwtAuthService: JwtAuthService) {}

  @Get()
  @UseGuards(FortyTwoGuard)
  async fortyTwoAuth(@Req() _req) {
    // Guard redirects
  }

  @Get('redirect')
  @UseGuards(FortyTwoGuard)
  async fortyTwoAuthRedirect(@Req() req: any, @Res() res: Response) {
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

    return res.status(201).json({ jwt });
  }
}