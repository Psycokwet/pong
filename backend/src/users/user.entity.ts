import {
  BaseEntity,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Game } from 'src/game/game.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  username: string;

  @Column({ length: 128, unique: true })
  email: string;

  @Column({ nullable: true })
  user_rank: number;

  @OneToMany(() => Game, (game) => game.player1)
  games_player1!: Game[];

  @OneToMany(() => Game, (game) => game.player2)
  games_player2!: Game[];

  @OneToMany(() => Friend, (friend) => friend.user)
  friends!: Friend[];
  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}
