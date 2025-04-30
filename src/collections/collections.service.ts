import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from './entities/collection.entity';
import { CreateCollectionDto, UpdateCollectionDto } from './dto/collection.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CollectionsService {
  constructor(
    @InjectRepository(Collection)
    private collectionsRepository: Repository<Collection>,
  ) {}

  async create(createCollectionDto: CreateCollectionDto, user: User) {
    const collection = this.collectionsRepository.create({
      ...createCollectionDto,
      user_id: user.id,
    });
    return this.collectionsRepository.save(collection);
  }

  async findAll(user: User) {
    return this.collectionsRepository.find({
      where: { user_id: user.id },
      relations: ['cigar', 'cigar.brand'],
    });
  }

  async findOne(id: string, user: User) {
    const collection = await this.collectionsRepository.findOne({
      where: { id, user_id: user.id },
      relations: ['cigar', 'cigar.brand'],
    });
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
    return collection;
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
    user: User,
  ) {
    const collection = await this.findOne(id, user);
    Object.assign(collection, updateCollectionDto);
    return this.collectionsRepository.save(collection);
  }

  async remove(id: string, user: User) {
    const result = await this.collectionsRepository.delete({
      id,
      user_id: user.id,
    });
    if (result.affected === 0) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
  }
}
