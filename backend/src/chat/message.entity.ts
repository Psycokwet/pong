import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';
import Room from './room.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
class Message {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty({ message: 'Your message must contain something' })
  public content: string;

  @ManyToOne(() => User)
  public author: User;

  @ManyToOne(() => Room)
  public room: Room;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}

export default Message;
