import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import {
  BrandGetDTO,
  BrandPostPayload,
  BrandPatchPayload,
} from './dto/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll(): Promise<BrandGetDTO[]> {
    const brands = await this.brandRepository.find();
    return brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      site_url: brand.site_url,
      created_at: brand.created_at,
      updated_at: brand.updated_at,
    }));
  }

  async create(brandDto: BrandPostPayload): Promise<BrandGetDTO> {
    const brand = this.brandRepository.create({
      name: brandDto.name,
      site_url: brandDto.site_url || null,
    });
    const savedBrand = await this.brandRepository.save(brand);
    return {
      id: savedBrand.id,
      name: savedBrand.name,
      site_url: savedBrand.site_url,
      created_at: savedBrand.created_at,
      updated_at: savedBrand.updated_at,
    };
  }

  async update(id: string, brandDto: BrandPatchPayload): Promise<BrandGetDTO> {
    if (!brandDto.name && brandDto.site_url === undefined) {
      throw new BadRequestException(
        'At least one field (name or site_url) must be provided',
      );
    }
    const brand = await this.brandRepository.findOne({ where: { id } });
    if (!brand) {
      throw new NotFoundException('Brand not found');
    }
    const updatedBrand = await this.brandRepository.save({
      ...brand,
      name: brandDto.name || brand.name,
      site_url:
        brandDto.site_url === undefined
          ? brand.site_url
          : brandDto.site_url || null,
    });
    return {
      id: updatedBrand.id,
      name: updatedBrand.name,
      site_url: updatedBrand.site_url,
      created_at: updatedBrand.created_at,
      updated_at: updatedBrand.updated_at,
    };
  }
}
