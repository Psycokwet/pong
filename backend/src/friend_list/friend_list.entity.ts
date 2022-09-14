import { User } from "src/users/user.entity";
import { 
  BaseEntity, 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  friend_id: number;

  @ManyToOne( () => User, (user) => user.friends)
  friend: User;
}