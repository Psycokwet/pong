import {
  BaseEntity,
  Column,
  JoinColumn,
  OneToOne,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Game } from 'src/game/game.entity';
import { Friend } from 'src/friend_list/friend.entity';
import { Exclude } from 'class-transformer';
import LocalFile from 'src/localFiles/localFile.entity';
import Room from 'src/chat/room.entity';
import Message from 'src/chat/message.entity';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  login42: string;

  @Column({ nullable: false, unique: true })
  pongUsername: string;

  @Column({ length: 128, unique: true })
  email: string;

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

  @Column()
  xp: number;

  @Column({
    nullable: true,
  })
  @Exclude()
  public currentHashedRefreshToken?: string;

  @OneToMany(() => Room, (Room) => Room.owner)
  public rooms: Room[];

  @ManyToMany(() => Room, (room) => room.members)
  public channels: Room[];

  @OneToMany(() => Message, (message) => message.author)
  public messages: Message[];

  @Column({ nullable: true })
  public mutedAt: number;

  @Column({
    nullable: false,
  })
  public isTwoFactorAuthenticationActivated: boolean;

  @Column({
    nullable: true,
  })
  public twoFactorAuthenticationSecret?: string;
}
