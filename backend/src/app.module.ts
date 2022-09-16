import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/user.entity';
import { FortyTwoModule } from './auth/fortytwo.module';
import { ConfigModule } from '@nestjs/config';
<<<<<<< HEAD
import { Friend } from './friend_list/friend.entity';
import { Game } from './game/game.entity';

=======
import { AuthModule } from './auth/auth.module';
>>>>>>> main
@Module({
  imports: [
    ConfigModule.forRoot(),
    FortyTwoModule,
    AuthModule,
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
