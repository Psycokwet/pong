import {
  PrimaryGeneratedColumn,
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  BaseEntity,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Game extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  player1_id: number;

  @Column({ nullable: false })
  player2_id: number;

  @Column({ nullable: false })
  winner: number;

  @ManyToOne(() => User, (user) => user.games_player1)
  player1: User;

  @ManyToOne(() => User, (user) => user.games_player2)
  player2: User;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @Column({ default: 0, nullable: false })
  player1Score: number;

  @Column({ default: 0, nullable: false })
  player2Score: number;
}
