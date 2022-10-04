import { User } from 'src/user/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import Room from './room.entity';

@Entity()
export class Banned extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bannedUserId: number;

  @OneToOne(() => User)
  @JoinTable()
  bannedUser: User;

  @Column()
  roomId: number;

  @OneToOne(() => Room)
  @JoinTable()
  room: Room;

  @Column({ type: 'bigint' })
  unbanAt: number;
}
