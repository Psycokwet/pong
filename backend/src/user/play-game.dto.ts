import { IsNotEmpty, IsString } from 'class-validator';

export class PlayGameDto {
  @IsString()
  @IsNotEmpty({ message: 'You must have a p1' })
  player1: string;

  @IsString()
  @IsNotEmpty({ message: 'You must have a p2' })
  player2: string;

  @IsString()
  @IsNotEmpty({ message: 'You must have a winner' })
  winner: string;
}
