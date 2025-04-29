import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CigarController } from './cigar.controller';
import { CigarService } from './cigar.service';
import { Cigar } from './entities/cigar.entity';
import { Brand } from '../brands/entities/brand.entity';
import { BrandModule } from '../brands/brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cigar, Brand]), BrandModule],
  controllers: [CigarController],
  providers: [CigarService],
  exports: [CigarService],
})
export class CigarModule {}
