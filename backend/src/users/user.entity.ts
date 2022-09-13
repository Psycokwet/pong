import LocalFile from 'src/localFiles/localFile.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
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

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(
    () => LocalFile,
    {
      nullable: true
    }
  )
  public avatar?: LocalFile;

  @Column({ nullable: true })
  public avatarId?: number;
}
