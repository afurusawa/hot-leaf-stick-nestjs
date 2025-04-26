import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cigar } from '../../cigars/entities/cigar.entity';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  site_url: string | null;

  @OneToMany(() => Cigar, (cigar) => cigar.brand)
  cigars: Cigar[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
