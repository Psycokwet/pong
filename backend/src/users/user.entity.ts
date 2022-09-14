import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  username: string;

  @Column({ length: 128, unique: true })
  email: string;

  @Column({
    nullable: true
  })
  @Exclude()
  public currentHashedRefreshToken?: string;
}
