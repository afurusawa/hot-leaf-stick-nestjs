import { Test, TestingModule } from '@nestjs/testing';
import { CigarService } from './cigar.service';
import { Repository } from 'typeorm';
import { Cigar } from './entities/cigar.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Vitola } from './entities/vitola.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CigarGetDTO, CigarPostPayload } from './dto/cigar.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CigarService', () => {
  let service: CigarService;
  let cigarRepository: Repository<Cigar>;
  let brandRepository: Repository<Brand>;
  let vitolaRepository: Repository<Vitola>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CigarService,
        {
          provide: getRepositoryToken(Cigar),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Brand),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Vitola),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CigarService>(CigarService);
    cigarRepository = module.get<Repository<Cigar>>(getRepositoryToken(Cigar));
    brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
    vitolaRepository = module.get<Repository<Vitola>>(
      getRepositoryToken(Vitola),
    );
  });

  it('should return an array of cigars', async () => {
    const brand: Brand = {
      id: '1',
      name: 'Test Brand',
      site_url: null,
      cigars: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    const cigarEntities: Cigar[] = [
      {
        id: '1',
        name: 'Test Cigar',
        brand_id: brand.id,
        brand,
        vitolas: [],
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];
    const cigarDTOs: CigarGetDTO[] = cigarEntities.map((cigar) => ({
      id: cigar.id,
      name: cigar.name,
      brand_id: cigar.brand_id,
      brand_name: cigar.brand.name,
      vitolas: cigar.vitolas,
      created_at: cigar.created_at,
      updated_at: cigar.updated_at,
    }));
    jest.spyOn(cigarRepository, 'find').mockResolvedValue(cigarEntities);
    expect(await service.findAll()).toEqual(cigarDTOs);
  });

  it('should create a cigar', async () => {
    const brand: Brand = {
      id: '1',
      name: 'Test Brand',
      site_url: null,
      cigars: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    const cigarDto: CigarPostPayload = {
      name: 'Test Cigar',
      brand_id: brand.id,
    };
    const savedCigar: Cigar = {
      id: '1',
      name: cigarDto.name,
      brand_id: cigarDto.brand_id,
      brand,
      vitolas: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(brandRepository, 'findOne').mockResolvedValue(brand);
    jest.spyOn(cigarRepository, 'create').mockReturnValue(savedCigar);
    jest.spyOn(cigarRepository, 'save').mockResolvedValue(savedCigar);
    expect(await service.create(cigarDto)).toEqual({
      id: savedCigar.id,
      name: savedCigar.name,
      brand_id: savedCigar.brand_id,
      brand_name: savedCigar.brand.name,
      vitolas: savedCigar.vitolas,
      created_at: savedCigar.created_at,
      updated_at: savedCigar.updated_at,
    });
  });

  it('should update a cigar', async () => {
    const brand: Brand = {
      id: '1',
      name: 'Test Brand',
      site_url: null,
      cigars: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    const cigar: Cigar = {
      id: '1',
      name: 'Test Cigar',
      brand_id: brand.id,
      brand,
      vitolas: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    const cigarDto: CigarPostPayload = {
      name: 'Updated Cigar',
      brand_id: brand.id,
    };
    const updatedCigar: Cigar = {
      ...cigar,
      name: cigarDto.name,
      brand_id: cigarDto.brand_id,
    };
    jest.spyOn(cigarRepository, 'findOne').mockResolvedValue(cigar);
    jest.spyOn(brandRepository, 'findOne').mockResolvedValue(brand);
    jest.spyOn(cigarRepository, 'save').mockResolvedValue(updatedCigar);
    expect(await service.update('1', cigarDto)).toEqual({
      id: updatedCigar.id,
      name: updatedCigar.name,
      brand_id: updatedCigar.brand_id,
      brand_name: updatedCigar.brand.name,
      vitolas: updatedCigar.vitolas,
      created_at: updatedCigar.created_at,
      updated_at: updatedCigar.updated_at,
    });
  });

  it('should throw NotFoundException if cigar not found', async () => {
    jest.spyOn(cigarRepository, 'findOne').mockResolvedValue(null);
    await expect(
      service.update('1', { name: 'Updated Cigar', brand_id: '1' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if brand not found', async () => {
    const cigar: Cigar = {
      id: '1',
      name: 'Test Cigar',
      brand_id: '1',
      brand: null,
      vitolas: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(cigarRepository, 'findOne').mockResolvedValue(cigar);
    jest.spyOn(brandRepository, 'findOne').mockResolvedValue(null);
    await expect(
      service.update('1', { name: 'Updated Cigar', brand_id: '1' }),
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
    const cigar: Cigar = {
      id: '1',
      name: 'Test Cigar',
      brand_id: brand.id,
      brand,
      vitolas: [],
      created_at: new Date(),
      updated_at: new Date(),
    };
    jest.spyOn(cigarRepository, 'findOne').mockResolvedValue(cigar);
    jest.spyOn(brandRepository, 'findOne').mockResolvedValue(brand);
    await expect(service.update('1', {})).rejects.toThrow(BadRequestException);
  });
});
