import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
// import Room from './room.entity';
// import Message from './message.entity';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { ChatModule } from 'src/chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuthModule,
    JwtModule,
    UsersModule,
  ],
  providers: [GameGateway, GameService],
  exports: [GameGateway, GameService],
})
export class GameModule {}