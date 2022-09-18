import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { FortyTwoModule } from './auth/fortytwo.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
 
import { AuthModule } from './auth/auth.module';

import Message from './chat/message.entity';
import { ChatModule } from './chat/chat.module';
import { Game } from './game/game.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        CLIENT_ID: Joi.string().required(),
        CLIENT_SECRET: Joi.string().required(),
        CALLBACK_URL: Joi.string().required(),
        UPLOADED_FILES_DESTINATION: Joi.string().required(),
      })
    }),
    FortyTwoModule,
    AuthModule,
    ChatModule,
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
      entities: [User, Game],
    }),
    TypeOrmModule.forFeature([Message]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
