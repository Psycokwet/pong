import { IsNotEmpty, IsString } from 'class-validator';

export class GetFriendsListDto {
  @IsString()
  @IsNotEmpty({ message: 'You must have a login42' })
  login42: string;
}
