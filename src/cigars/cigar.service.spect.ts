// src/cigars/cigar.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { CigarService } from './cigar.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cigar } from './entities/cigar.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CigarService', () => {
  let service: CigarService;
  let cigarRepository: Repository<Cigar>;
  let brandRepository: Repository<Brand>;

  const mockCigar = {
    id: '1',
    name: 'Test Cigar',
    brand_id: '1',
    brand: { id: '1', name: 'Test Brand', cigars: [] },
    vitolas: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockBrand = { id: '1', name: 'Test Brand', cigars: [] };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CigarService,
        {
          provide: getRepositoryToken(Cigar),
          useValue: {
            find: jest.fn().mockResolvedValue([mockCigar]),
            findOne: jest.fn().mockResolvedValue(mockCigar),
            create: jest.fn().mockReturnValue(mockCigar),
            save: jest.fn().mockResolvedValue(mockCigar),
          },
        },
        {
          provide: getRepositoryToken(Brand),
          useValue: {
            findOne: jest.fn().mockResolvedValue(mockBrand),
          },
        },
      ],
    }).compile();

    service = module.get<CigarService>(CigarService);
    cigarRepository = module.get<Repository<Cigar>>(getRepositoryToken(Cigar));
    brandRepository = module.get<Repository<Brand>>(getRepositoryToken(Brand));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of cigars', async () => {
      const result = await service.findAll();
      expect(result).toEqual([
        {
          id: '1',
          name: 'Test Cigar',
          brand_id: '1',
          brand_name: 'Test Brand',
          vitolas: [],
          created_at: mockCigar.created_at,
          updated_at: mockCigar.updated_at,
        },
      ]);
      expect(cigarRepository.find).toHaveBeenCalledWith({
        relations: ['brand', 'vitolas'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a single cigar', async () => {
      const result = await service.findOne('1');
      expect(result).toEqual({
        id: '1',
        name: 'Test Cigar',
        brand_id: '1',
        brand_name: 'Test Brand',
        vitolas: [],
        created_at: mockCigar.created_at,
        updated_at: mockCigar.updated_at,
      });
      expect(cigarRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['brand', 'vitolas'],
      });
    });

    it('should throw NotFoundException if cigar not found', async () => {
      jest.spyOn(cigarRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('2')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and return a cigar', async () => {
      const createCigarDto = { name: 'Test Cigar', brand_id: '1' };
      const result = await service.create(createCigarDto);
      expect(result).toEqual({
        id: '1',
        name: 'Test Cigar',
        brand_id: '1',
      });
      expect(cigarRepository.create).toHaveBeenCalledWith({
        name: 'Test Cigar',
        brand_id: '1',
      });
      expect(cigarRepository.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if brand not found', async () => {
      jest.spyOn(brandRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.create({ name: 'Test Cigar', brand_id: '2' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return a cigar', async () => {
      const updateCigarDto = { name: 'Updated Cigar' };
      const result = await service.update('1', updateCigarDto);
      expect(result).toEqual({
        id: '1',
        name: 'Updated Cigar',
        brand_id: '1',
      });
      expect(cigarRepository.save).toHaveBeenCalled();
    });

    it('should throw BadRequestException if no fields provided', async () => {
      await expect(service.update('1', {})).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw NotFoundException if cigar not found', async () => {
      jest.spyOn(cigarRepository, 'findOne').mockResolvedValue(null);
      await expect(
        service.update('2', { name: 'Updated Cigar' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if brand not found', async () => {
      jest.spyOn(brandRepository, 'findOne').mockResolvedValue(null);
      await expect(service.update('1', { brand_id: '2' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
