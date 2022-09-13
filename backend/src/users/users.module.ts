import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtConstants } from 'src/auth/jwtConstants';
import { LocalFilesModule } from 'src/localFiles/localFiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    JwtModule.registerAsync({
      useFactory: async () => {
        return {
          secret: JwtConstants.secret,
          signOptions: {
            expiresIn: JwtConstants.expiresIn
          },
        };
      },
      inject: [],
    }),
    LocalFilesModule,
  ],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}
