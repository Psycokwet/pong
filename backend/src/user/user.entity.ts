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
import { Blocked } from 'src/blocked/blocked.entity';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  @IsNotEmpty({ message: 'You must enter a valid login42' })
  login42: string;

  @Column({ nullable: false, unique: true })
  @IsNotEmpty({ message: 'pongUsername is mandatory' })
  pongUsername: string;

  @Column({ length: 128, unique: true })
  @IsEmail({ message: 'Please enter a valid email' })
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

  @Column({ default: 0 })
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

  @OneToMany(() => Blocked, (blocked) => blocked.blockedUser)
  public blockedList!: Blocked[];

  @Column({
    nullable: false,
  })
  public isTwoFactorAuthenticationActivated: boolean;

  @Column({
    nullable: false,
  })
  public isUserFullySignedUp: boolean;

  @Column({
    nullable: true,
  })
  public twoFactorAuthenticationSecret?: string;
}
