import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/protected')
  @UseGuards(JwtAuthGuard)
  getProtected(): string {
    return this.appService.getProtected();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
