import {
  Catch,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AppService } from '../app.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { QueryFailedError } from 'typeorm';
import { AuthUserIdDto } from './auth-user.dto';

@Controller('/auth/')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);
  private reqId = 1;

  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req: { user: AuthUserIdDto }) {
    const reqId = this.reqId++;
    this.logger.log(`${reqId} got user ${req.user}`);
    return this.authService.login(req.user);
  }

  @UseGuards(LocalAuthGuard)
  @Delete()
  async logout(@Request() req: any) {
    req.logout((err: any) => {
      if (err) {
        this.logger.error(err);
      }
    });
  }
}
