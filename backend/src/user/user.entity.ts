import LocalFile from 'src/localFiles/localFile.entity';
import {
  BaseEntity,
  Column,
  JoinColumn,
  OneToOne,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Game } from 'src/game/game.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { Exclude } from 'class-transformer';
import Room from 'src/chat/room.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  login42: string;

  @Column({ nullable: true })
  pongUsername: string;

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

  @JoinColumn({ name: 'pictureId' })
  @OneToOne(() => LocalFile, { nullable: true })
  public picture?: LocalFile;

  @Column({ nullable: true })
  public pictureId?: number;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToMany(() => Room, (Room) => Room.owner)
  public rooms: Room[];

  @Column({
    nullable: false,
  })
  public is_2fa_activated: boolean;
}
