import { IsNotEmpty, IsString } from 'class-validator';

export class pongUsernameDto {
  @IsString()
  @IsNotEmpty({ message: 'You must send a new login42' })
  newPongUsername: string;
}
