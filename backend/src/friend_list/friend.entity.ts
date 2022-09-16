import { 
  BaseEntity, 
  Column, 
  Entity, 
  ManyToOne, 
  PrimaryGeneratedColumn 
} from "typeorm";
import { User } from "src/users/user.entity";

@Entity()
export class Friend extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  friend_id: number;

  //Following: OneToOne
  @ManyToOne( () => User, (user) => user.friends)
  user: User;
}