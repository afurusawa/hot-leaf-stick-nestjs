import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Cigar } from './cigars/entities/cigar.entity';
import { Brand } from './brands/entities/brand.entity';
import { Vitola } from './cigars/entities/vitola.entity';

const configService = new ConfigService();

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [Cigar, Brand, Vitola],
  synchronize: false,
  migrations: ['./migrations/*.ts'],
});
