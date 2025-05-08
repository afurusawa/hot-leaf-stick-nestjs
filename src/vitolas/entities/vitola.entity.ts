// src/vitolas/entities/vitola.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Cigar } from '../../cigars/entities/cigar.entity';
import { Collection } from '../../collections/entities/collection.entity';

@Entity()
export class Vitola {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('decimal', { precision: 4, scale: 2 })
  length: number;

  @Column('integer')
  ring_gauge: number;

  @ManyToOne(() => Cigar, (cigar) => cigar.vitolas)
  cigar: Cigar;

  @OneToMany(() => Collection, (collection) => collection.vitola)
  collections: Collection[];
}
