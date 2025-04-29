// src/vitolas/entities/vitola.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Cigar } from '../../cigars/entities/cigar.entity';

@Entity()
export class Vitola {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  length: number;

  @Column()
  ring_gauge: number;

  @ManyToOne(() => Cigar, (cigar) => cigar.vitolas)
  cigar: Cigar;
}
