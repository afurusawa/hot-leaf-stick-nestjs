import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vitola } from './entities/vitola.entity';
import { Cigar } from '../cigars/entities/cigar.entity';
import { CreateVitolaDto } from './dto/vitola.dto';

@Injectable()
export class VitolaService {
  constructor(
    @InjectRepository(Vitola)
    private readonly vitolaRepository: Repository<Vitola>,
    @InjectRepository(Cigar)
    private readonly cigarRepository: Repository<Cigar>,
  ) {}

  async findAll(): Promise<Vitola[]> {
    return this.vitolaRepository.find();
  }

  async findOne(id: string): Promise<Vitola> {
    const vitola = await this.vitolaRepository.findOne({ where: { id } });
    if (!vitola) {
      throw new NotFoundException('Vitola not found');
    }
    return vitola;
  }

  async create(createVitolaDto: CreateVitolaDto): Promise<Vitola> {
    const cigar = await this.cigarRepository.findOne({
      where: { id: createVitolaDto.cigar_id },
    });
    if (!cigar) throw new Error('Cigar not found');

    const vitola = this.vitolaRepository.create({
      ...createVitolaDto,
      cigar,
    });
    return this.vitolaRepository.save(vitola);
  }

  async update(id: string, updateVitolaDto: CreateVitolaDto): Promise<Vitola> {
    const cigar = await this.cigarRepository.findOne({
      where: { id: updateVitolaDto.cigar_id },
    });
    if (!cigar) throw new Error('Cigar not found');

    await this.vitolaRepository.update(id, {
      ...updateVitolaDto,
      cigar,
    });
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const vitola = await this.findOne(id);
    await this.vitolaRepository.remove(vitola);
  }
}
