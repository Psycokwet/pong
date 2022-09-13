import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UserController } from './users/user.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'postgres',
      password: 'localroot',
      database: 'db',
      autoLoadEntities: true,
      synchronize: true, // to disable in prod
    }),
  ],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule {}
