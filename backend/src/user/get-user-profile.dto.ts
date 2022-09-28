import { IsNotEmpty, IsString } from 'class-validator';

export class GetUserProfileDto {
  // @IsString() can't leave it with the possibility to get current user profile by default
  pongUsername: string;
}
