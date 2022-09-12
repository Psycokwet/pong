import { Injectable, Logger } from '@nestjs/common';
// this is an example of logger use.
// as well as a mean to test that the server is correctly launch, since
// you'll get "hello world" from localhost/api/ in dev

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.log('Hello');
    return 'Hello World!';
  }

  getProtected(): string {
    this.logger.log('Protected');
    return 'Hello Protected!';
  }
}
