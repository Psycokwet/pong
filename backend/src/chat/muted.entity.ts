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
export class Muted extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mutedUserId: number;

  @OneToOne(() => User)
  @JoinTable()
  mutedUser: User;

  @Column()
  roomId: number;

  @OneToOne(() => Room)
  @JoinTable()
  room: Room;

  @Column({ type: 'bigint' })
  unmuteAt: number;
}
