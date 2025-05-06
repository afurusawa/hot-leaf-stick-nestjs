import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cigar } from '../../cigars/entities/cigar.entity';
import { User } from '../../users/entities/user.entity';
import { Vitola } from 'src/vitolas/entities/vitola.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  user_id: string;

  @ManyToOne(() => User, (user: User) => user.collections)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'cigar_id' })
  cigar_id: string;

  @ManyToOne(() => Cigar, (cigar: Cigar) => cigar.collections)
  @JoinColumn({ name: 'cigar_id' })
  cigar: Cigar;

  @Column({ name: 'vitola_id' })
  vitola_id: string;

  @ManyToOne(() => Vitola, (vitola: Vitola) => vitola.collections)
  @JoinColumn({ name: 'vitola_id' })
  vitola: Vitola;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'timestamp', nullable: true })
  storage_date: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
