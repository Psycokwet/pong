import { IsNotEmpty, IsString } from 'class-validator';

export class pongUsernameDto {
  @IsString()
  @IsNotEmpty({ message: 'You must have a login42' })
  login42: string;

  @IsString()
  @IsNotEmpty({ message: 'You must send a new login42' })
  new_pongUsername: string;
}
