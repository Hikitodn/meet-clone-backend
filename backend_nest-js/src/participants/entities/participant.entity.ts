import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Participant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  room_id: string;
}
