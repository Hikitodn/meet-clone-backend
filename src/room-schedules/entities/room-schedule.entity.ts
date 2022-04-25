import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RoomSchedule {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column()
  room_id: string;

  @Column('timestamp without time zone')
  advance_notice: Date;

  @Column({ type: 'timestamp without time zone', nullable: false })
  start_date: Date;

  @Column({ type: 'timestamp without time zone', nullable: false })
  end_date: Date;

  @Column()
  description: string;

  @CreateDateColumn({
    type: 'timestamp without time zone',
  })
  created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp without time zone',
  })
  updated_at: Date;
}
