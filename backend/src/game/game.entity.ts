import { 
  PrimaryGeneratedColumn, 
  Entity, 
  Column, 
  ManyToOne, 
  ManyToMany, 
  JoinTable 
} from "typeorm";
import { User } from "../users/user.entity"

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    player1_id: number;

    @Column()
    player2_id: number;

    @Column()
    winner: number;

    @ManyToOne(() => User, (user) => user.games_player1)
    player1: User;

    @ManyToOne(() => User, (user) => user.games_player2)
    player2: User;
}