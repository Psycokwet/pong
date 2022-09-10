import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 128, unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ length: 128, unique: true })
  email: string;
}
