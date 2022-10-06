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

  @ManyToOne(() => User, { cascade: true })
  public author: User;

  @ManyToOne(() => Room, { cascade: true, onDelete: 'CASCADE' })
  public room: Room;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;
}

export default Message;
