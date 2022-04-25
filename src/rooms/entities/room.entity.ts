import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  room_name: string;

  @Column()
  user_id: string;

  @Column({ nullable: false })
  friendly_id: string;

  @Column({
    nullable: false,
  })
  display_mode: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
  })
  updated_at: Date;
}
