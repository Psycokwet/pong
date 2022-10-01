import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user/user.entity';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AuthModule } from './auth/auth.module';

import Message from './chat/message.entity';
import { ChatModule } from './chat/chat.module';
import { Game } from './game/game.entity';
import LocalFile from './localFiles/localFile.entity';
import { TwoFactorAuthModule } from './two-factor-auth/two-factor-auth.module';
import { GameModule } from './game/game.module';
import Room from './chat/room.entity';
import { UsersModule } from './user/user.module';
import { Friend } from './friend_list/friend.entity';
import { FortytwoService } from './fortytwo/fortytwo.service';
import { FortyTwoModule } from './fortytwo/fortytwo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        CALLBACK_URL: Joi.string().required(),
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      }),
    }),
    FortyTwoModule,
    UsersModule,
    AuthModule,
    ChatModule,
    GameModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      // host: 'localhost',
      host: 'database',
      port: 5432,
      username: 'postgres',
      password: 'localroot',
      database: 'db',
      autoLoadEntities: true,
      synchronize: true, // to disable in prod
      entities: [User, Game, LocalFile, Message, Room, Friend],
    }),
    TwoFactorAuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, FortytwoService],
})
export class AppModule {}
