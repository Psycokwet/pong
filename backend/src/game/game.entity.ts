import { PrimaryGeneratedColumn, Entity, Column, ManyToOne } from "typeorm";
import { User } from "../users/user.entity"

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    player1: number;

    @Column()
    player2: number;

    @Column()
    winner: number;

    //ManyToMany
    @ManyToOne(() => User, (user) => user.games)
    user: User;
}