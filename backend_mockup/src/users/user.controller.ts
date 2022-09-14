import {
  Controller,
  Logger,
  Post,
} from '@nestjs/common';

@Controller('/user/')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor() {}

  @Post()
  async createUser() {
    this.logger.log("createUser called")
  }
}
