import { Game } from 'src/game/game.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';

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



  // @ManyToMany(() => Game)
  // @JoinTable()
  // games: Game[];
  // @OneToMany(() => Game, (game) => game.users)
  // games!: Game[];

  @OneToMany(() => Game, (game) => game.player1)
  games_player1!: Game[];
  
  @OneToMany(() => Game, (game) => game.player2)
  games_player2!: Game[];
}
