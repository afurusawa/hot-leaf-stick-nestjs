// src/cigars/entities/cigar.entity.ts
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Brand } from '../../brands/entities/brand.entity';
import { Vitola } from '../../vitolas/entities/vitola.entity';
import { Collection } from '../../collections/entities/collection.entity';

@Entity('cigars')
export class Cigar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  brand_id: string;

  @ManyToOne(() => Brand, (brand) => brand.cigars)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @OneToMany(() => Vitola, (vitola) => vitola.cigar)
  vitolas: Vitola[];

  @OneToMany(() => Collection, (collection) => collection.cigar)
  collections: Collection[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
