import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VitolaController } from './vitola.controller';
import { VitolaService } from './vitola.service';
import { Vitola } from './entities/vitola.entity';
import { Cigar } from '../cigars/entities/cigar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vitola, Cigar])],
  controllers: [VitolaController],
  providers: [VitolaService],
  exports: [VitolaService],
})
export class VitolasModule {}
