import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cigar } from '../src/cigars/entities/cigar.entity';
import { Brand } from '../src/brands/entities/brand.entity';
import { Vitola } from '../src/cigars/entities/vitola.entity';

export async function setupTestApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [
      AppModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'test_user',
        password: 'test_password',
        database: 'test_database',
        entities: [Cigar, Brand, Vitola],
        synchronize: true,
        dropSchema: true,
      }),
    ],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();
  return app;
}
