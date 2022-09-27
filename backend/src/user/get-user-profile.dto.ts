import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserProfileDto {
  @IsString()
  @IsNotEmpty({ message: 'You must have a pongUsername' })
  pongUsername: string;
}
