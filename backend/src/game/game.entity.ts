import { PrimaryGeneratedColumn, Entity, Column, ManyToOne, ManyToMany, JoinTable} from "typeorm";
import { User } from "../users/user.entity"

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    player1_id!: number;

    // @Column( {nullable: true} )
    // player1_username: string;

    @Column()
    player2_id!: number;

    // @Column( {nullable: true} )
    // player2_username: string;

    @Column()
    winner!: number;

    // @Column( {nullable: true} )
    // winner_username: string;

    // @ManyToMany(() => User)
    // @JoinTable()
    // users!: User[];

    @ManyToOne(() => User, (user) => user.games_player1)
    player1!: User;

    @ManyToOne(() => User, (user) => user.games_player2)
    player2!: User;
}