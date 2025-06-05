import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vitola } from './entities/vitola.entity';
import { Cigar } from '../cigars/entities/cigar.entity';
import { CreateVitolaDto, UpdateVitolaDto } from './dto/vitola.dto';

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

  async findByCigar(cigarId: string): Promise<Vitola[]> {
    const cigar = await this.cigarRepository.findOne({
      where: { id: cigarId },
    });
    if (!cigar) {
      throw new NotFoundException('Cigar not found');
    }
    return this.vitolaRepository.find({
      where: { cigar: { id: cigarId } },
    });
  }

  async findOne(id: string): Promise<Vitola> {
    const vitola = await this.vitolaRepository.findOne({ where: { id } });
    if (!vitola) {
      throw new NotFoundException('Vitola not found');
    }
    return vitola;
  }

  async create(createVitolaDto: CreateVitolaDto): Promise<Vitola> {
    try {
      const cigar = await this.cigarRepository.findOne({
        where: { id: createVitolaDto.cigar_id },
      });
      if (!cigar) {
        throw new NotFoundException('Cigar not found');
      }

      const vitola = this.vitolaRepository.create({
        ...createVitolaDto,
        cigar,
      });
      return await this.vitolaRepository.save(vitola);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error creating vitola:', error);
      throw new BadRequestException(
        'Failed to create vitola: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async update(id: string, updateVitolaDto: UpdateVitolaDto): Promise<Vitola> {
    try {
      const vitola = await this.findOne(id); // Verify vitola exists

      let cigar = vitola.cigar;
      if (updateVitolaDto.cigar_id) {
        const newCigar = await this.cigarRepository.findOne({
          where: { id: updateVitolaDto.cigar_id },
        });
        if (!newCigar) {
          throw new NotFoundException('Cigar not found');
        }
        cigar = newCigar;
      }

      const { ...updateData } = updateVitolaDto;
      await this.vitolaRepository.update(id, {
        ...updateData,
        cigar,
      });
      return this.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      console.error('Error updating vitola:', error);
      throw new BadRequestException(
        'Failed to update vitola: ' +
          (error instanceof Error ? error.message : 'Unknown error'),
      );
    }
  }

  async remove(id: string): Promise<void> {
    const vitola = await this.findOne(id);
    await this.vitolaRepository.remove(vitola);
  }
}
