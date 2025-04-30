import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { Collection } from './entities/collection.entity';
import { Cigar } from '../cigars/entities/cigar.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Collection, Cigar, User])],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
