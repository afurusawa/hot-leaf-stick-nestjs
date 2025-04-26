import { Test, TestingModule } from '@nestjs/testing';
import { BrandService } from './brand.service';
import { Repository } from 'typeorm';
import { Brand } from './entities/brand.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BrandGetDTO, BrandPostPayload } from './dto/brand.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BrandService', () => {
  let service: BrandService;
  let brandRepository: Repository<Brand>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandService,
        {
          provide: getRepositoryToken(Brand),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<BrandService>(BrandService);
    brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
  });

  it('should return an array of brands', async () => {
    const brandEntities: Brand[] = [
      {
        id: '1',
        name: 'Test Brand',
        site_url: null,
        cigars: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const brandDTOs: BrandGetDTO[] = brandEntities.map((brand) => ({
      id: brand.id,
      name: brand.name,
      site_url: brand.site_url,
      created_at: brand.created_at,
      updated_at: brand.updated_at,
    }));
    jest.spyOn(brandRepository, 'find').mockResolvedValue(brandEntities);
    expect(await service.findAll()).toEqual(brandDTOs);
  });

  it('should create a brand', async () => {
    const brandDto: BrandPostPayload = {
      name: 'Test Brand',
      site_url: 'https://www.testbrand.com',
    };
    const savedBrand: Brand = {
      id: '1',
      name: brandDto.name,
      site_url: brandDto.site_url || null,
      cigars: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(brandRepository, 'create').mockReturnValue(savedBrand);
    jest.spyOn(brandRepository, 'save').mockResolvedValue(savedBrand);
    expect(await service.create(brandDto)).toEqual({
      id: savedBrand.id,
      name: savedBrand.name,
      site_url: savedBrand.site_url,
      created_at: savedBrand.created_at,
      updated_at: savedBrand.updated_at,
    });
  });

  it('should update a brand', async () => {
    const brand: Brand = {
      id: '1',
      name: 'Test Brand',
      site_url: null,
      cigars: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    const brandDto: BrandPostPayload = {
      name: 'Updated Brand',
      site_url: 'https://www.updatedbrand.com',
    };
    const updatedBrand: Brand = {
      ...brand,
      name: brandDto.name,
      site_url: brandDto.site_url || null,
    };
    jest.spyOn(brandRepository, 'findOne').mockResolvedValue(brand);
    jest.spyOn(brandRepository, 'save').mockResolvedValue(updatedBrand);
    expect(await service.update('1', brandDto)).toEqual({
      id: updatedBrand.id,
      name: updatedBrand.name,
      site_url: updatedBrand.site_url,
      created_at: updatedBrand.created_at,
      updated_at: updatedBrand.updated_at,
    });
  });

  it('should throw NotFoundException if brand not found', async () => {
    jest.spyOn(brandRepository, 'findOne').mockResolvedValue(null);
    await expect(
      service.update('1', { name: 'Updated Brand' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if no fields provided', async () => {
    const brand: Brand = {
      id: '1',
      name: 'Test Brand',
      site_url: null,
      cigars: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(brandRepository, 'findOne').mockResolvedValue(brand);
    await expect(service.update('1', {})).rejects.toThrow(BadRequestException);
  });
});
