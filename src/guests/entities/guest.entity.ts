import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('guest')
export class Guest {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  room_id: string;

  @Column()
  email: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
  })
  updated_at: Date;
}
