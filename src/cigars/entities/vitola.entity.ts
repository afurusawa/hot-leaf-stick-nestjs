// src/cigars/entities/vitola.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cigar } from './cigar.entity';

@Entity('vitolas')
export class Vitola {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('float')
  length: number;

  @Column('float')
  ring_gauge: number;

  @Column()
  cigar_id: string;

  @ManyToOne(() => Cigar, (cigar) => cigar.vitolas)
  @JoinColumn({ name: 'cigar_id' })
  cigar: Cigar;
}
