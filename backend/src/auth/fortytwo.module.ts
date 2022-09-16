import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { FortyTwoController } from './fortytwo.controller';
import { FortyTwoStrategy } from './fortytwo.strategy';
import { JwtAuthModule } from './jwt.module';

@Module({
  imports: [JwtAuthModule, UsersModule, TypeOrmModule.forFeature([User])],
  controllers: [FortyTwoController],
  providers: [FortyTwoStrategy, UsersService, AuthService],
})
export class FortyTwoModule {}