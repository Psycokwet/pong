import { IsNotEmpty, IsString } from 'class-validator';

export class GetFriendsListDto {
  @IsString()
  @IsNotEmpty({ message: 'You must have a username' })
  username: string;
}
