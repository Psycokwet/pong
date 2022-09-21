import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

import { ROUTES_BASE } from 'shared/routes';

@Controller(ROUTES_BASE.ROOT.ENDPOINT)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get(ROUTES_BASE.ROOT.PROTECTED)
  @UseGuards(JwtAuthGuard)
  getProtected(): string {
    return this.appService.getProtected();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
