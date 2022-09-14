import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { AppService } from './app.service';

@Module({
  imports: [
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
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
