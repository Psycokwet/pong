import { IsNotEmpty, IsString } from 'class-validator';

export class AddFriendDto {
  @IsString()
  @IsNotEmpty({ message: 'You must have a login42' })
  login42: string;

  @IsString()
  @IsNotEmpty({ message: 'You must have a friend_to_add' })
  friend_to_add: string;
}
