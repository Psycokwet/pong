import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity()
export class Blocked extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  blockedId: number;

  @ManyToOne(() => User, (user) => user.blockedList)
  blockedUser: User;
}
