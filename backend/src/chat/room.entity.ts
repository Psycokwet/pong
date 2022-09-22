import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import Message from './message.entity';

@Entity()
class Room extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  // displayed name for frontend
  @Column()
  public channelName: string;

  // use only in backend
  @Column({ unique: true })
  public roomName: string;

  @Column()
  public password: string;

  @ManyToOne(() => User, (user) => user.rooms)
  public owner: User;

  @OneToMany(() => Message, (message) => message.room)
  public messages: Message[];

  @ManyToMany(() => User, (user) => user.channels, { cascade: true })
  @JoinTable()
  public members: User[];

  @Column()
  public isChannelPrivate: boolean;
}

export default Room;
