import { IsNotEmpty, IsString } from 'class-validator';

export class SetUsernameDto {
  @IsString()
  @IsNotEmpty({ message: 'You must have a username' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'You must send a new username' })
  new_username: string;
}
