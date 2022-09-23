import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import Room from './room.entity';
import Message from './message.entity';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/user/user.module';
import { User } from 'src/user/user.entity';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Room, Message]),
    AuthModule,
    JwtModule,
    UsersModule,
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatGateway, ChatService],
})
export class ChatModule {}
