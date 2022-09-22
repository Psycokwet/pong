import { IsNotEmpty, IsString } from 'class-validator';

export class pongUsernameDto {
  @IsString()
  @IsNotEmpty({ message: 'You must send a new pong username' })
  newPongUsername: string;
}
