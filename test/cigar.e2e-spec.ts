import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cigar } from '../src/cigars/entities/cigar.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { Vitola } from '../src/cigars/entities/vitola.entity';

describe('Cigar and Brand Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Brands', () => {
    it('/brands (GET)', () => {
      return request(app.getHttpServer()).get('/brands').expect(200).expect([]);
    });

    it('/brands (POST)', () => {
      return request(app.getHttpServer())
        .post('/brands')
        .send({ name: 'Test Brand', site_url: 'https://www.testbrand.com' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Brand');
          expect(res.body.site_url).toBe('https://www.testbrand.com');
        });
    });
    it('/brands/:id (PATCH)', async () => {
      const brandResponse = await request(app.getHttpServer())
        .post('/brands')
        .send({ name: 'Test Brand', site_url: 'https://www.testbrand.com' });

      const brandId = brandResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/brands/${brandId}`)
        .send({ name: 'Updated Brand' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', brandId);
          expect(res.body.name).toBe('Updated Brand');
          expect(res.body.site_url).toBe('https://www.testbrand.com');
        });
    });
  });

  describe('Cigars', () => {
    let brandId: string;

    beforeAll(async () => {
      const brandResponse = await request(app.getHttpServer())
        .post('/brands')
        .send({ name: 'Test Brand' });
      brandId = brandResponse.body.id;
    });

    it('/cigars (GET)', () => {
      return request(app.getHttpServer()).get('/cigars').expect(200).expect([]);
    });

    it('/cigars (POST)', () => {
      return request(app.getHttpServer())
        .post('/cigars')
        .send({ name: 'Test Cigar', brand_id: brandId })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Test Cigar');
          expect(res.body.brand_id).toBe(brandId);
        });
    });

    it('/cigars/:id (GET)', async () => {
      const cigarResponse = await request(app.getHttpServer())
        .post('/cigars')
        .send({ name: 'Test Cigar', brand_id: brandId });

      const cigarId = cigarResponse.body.id;

      return request(app.getHttpServer())
        .get(`/cigars/${cigarId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', cigarId);
          expect(res.body.name).toBe('Test Cigar');
          expect(res.body.brand_name).toBe('Test Brand');
        });
    });

    it('/cigars/:id (PATCH)', async () => {
      const cigarResponse = await request(app.getHttpServer())
        .post('/cigars')
        .send({ name: 'Test Cigar', brand_id: brandId });

      const cigarId = cigarResponse.body.id;

      return request(app.getHttpServer())
        .patch(`/cigars/${cigarId}`)
        .send({ name: 'Updated Cigar' })
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', cigarId);
          expect(res.body.name).toBe('Updated Cigar');
          expect(res.body.brand_id).toBe(brandId);
        });
    });

    it('/cigars/:id (GET) - not found', () => {
      return request(app.getHttpServer()).get('/cigars/invalid-id').expect(404);
    });
  });
});
