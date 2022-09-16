import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { FortyTwoModule } from './auth/fortytwo.module';
import { ConfigModule } from '@nestjs/config';
import { Friend } from './friend_list/friend.entity';
import { Game } from './game/game.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    FortyTwoModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'postgres',
      password: 'localroot',
      database: 'db',
      autoLoadEntities: true,
      synchronize: true, // to disable in prod
      entities: [User, Friend, Game],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
