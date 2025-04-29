import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cigar } from './entities/cigar.entity';
import {
  CigarGetDTO,
  CigarPostPayload,
  CigarPatchPayload,
} from './dto/cigar.dto';
import { BrandService } from '../brands/brand.service';

@Injectable()
export class CigarService {
  constructor(
    @InjectRepository(Cigar)
    private readonly cigarRepository: Repository<Cigar>,
    private readonly brandService: BrandService,
  ) {}

  async findAll(): Promise<CigarGetDTO[]> {
    const cigars = await this.cigarRepository.find({
      relations: ['brand', 'vitolas'],
    });
    return cigars.map((cigar) => ({
      id: cigar.id,
      name: cigar.name,
      brand_id: cigar.brand_id,
      brand_name: cigar.brand.name,
      vitolas: cigar.vitolas || [],
      created_at: cigar.created_at,
      updated_at: cigar.updated_at,
    }));
  }

  async findOne(id: string): Promise<CigarGetDTO> {
    const cigar = await this.cigarRepository.findOne({
      where: { id },
      relations: ['brand', 'vitolas'],
    });
    if (!cigar) {
      throw new NotFoundException('Cigar not found');
    }
    return {
      id: cigar.id,
      name: cigar.name,
      brand_id: cigar.brand_id,
      brand_name: cigar.brand.name,
      vitolas: cigar.vitolas || [],
      created_at: cigar.created_at,
      updated_at: cigar.updated_at,
    };
  }

  async create(cigarDto: CigarPostPayload): Promise<CigarGetDTO> {
    const brand = await this.brandService
      .findAll()
      .then((brands) => brands.find((b) => b.id === cigarDto.brand_id));
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const cigar = this.cigarRepository.create({
      name: cigarDto.name,
      brand_id: cigarDto.brand_id,
      brand,
    });
    const savedCigar = await this.cigarRepository.save(cigar);
    return {
      id: savedCigar.id,
      name: savedCigar.name,
      brand_id: savedCigar.brand_id,
      brand_name: savedCigar.brand.name,
      vitolas: savedCigar.vitolas || [],
      created_at: savedCigar.created_at,
      updated_at: savedCigar.updated_at,
    };
  }

  async update(id: string, cigarDto: CigarPatchPayload): Promise<CigarGetDTO> {
    if (!cigarDto.name && !cigarDto.brand_id) {
      throw new BadRequestException(
        'At least one valid field (name or brand_id) must be provided',
      );
    }
    const cigar = await this.cigarRepository.findOne({ where: { id } });
    if (!cigar) {
      throw new NotFoundException('Cigar not found');
    }
    if (cigarDto.brand_id) {
      const brand = await this.brandService
        .findAll()
        .then((brands) => brands.find((b) => b.id === cigarDto.brand_id));
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }
    const updatedCigar = await this.cigarRepository.save({
      ...cigar,
      name: cigarDto.name || cigar.name,
      brand_id: cigarDto.brand_id || cigar.brand_id,
    });
    return {
      id: updatedCigar.id,
      name: updatedCigar.name,
      brand_id: updatedCigar.brand_id,
      brand_name: updatedCigar.brand.name,
      vitolas: updatedCigar.vitolas || [],
      created_at: updatedCigar.created_at,
      updated_at: updatedCigar.updated_at,
    };
  }
}
