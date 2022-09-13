import { Game } from 'src/game/game.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ length: 128, unique: true })
  email: string;

  @Column({ nullable: true})
  user_rank: number;

  @OneToMany(() => Game, (game) => game.user)
  games: Game[];
}
