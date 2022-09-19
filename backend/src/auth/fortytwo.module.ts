import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/game/game.entity';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { JwtAuthModule } from './jwt.module';

@Module({
  imports: [JwtAuthModule, UsersModule, TypeOrmModule.forFeature([User, Game])],
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy],
})
export class FortyTwoModule {}
