import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Channel
{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 32, unique: true })
    channel_name: string;

    @Column()
    channel_type: string;

    @Column({ length: 128, nullable: true })
    channel_password: string;
}