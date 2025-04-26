import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './setup';
import { CigarGetDTO } from '../src/cigars/dto/cigar.dto';
import { BrandGetDTO } from 'src/brands/dto/brand.dto';

describe('CigarController (e2e)', () => {
  let app: INestApplication;
  let brandId: string;

  beforeAll(async () => {
    app = await setupTestApp();
    const brandResponse = await request(app.getHttpServer())
      .post('/brands')
      .send({ name: 'Test Brand' });
    const brand = brandResponse.body as BrandGetDTO;
    brandId = brand.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/cigars (GET)', () => {
    return request(app.getHttpServer())
      .get('/cigars')
      .expect(200)
      .expect((res) => {
        const cigars = res.body as CigarGetDTO[];
        expect(cigars).toEqual([]);
      });
  });

  it('/cigars (POST)', () => {
    return request(app.getHttpServer())
      .post('/cigars')
      .send({ name: 'Test Cigar', brand_id: brandId })
      .expect(200)
      .expect((res) => {
        const cigar = res.body as CigarGetDTO;
        expect(cigar).toHaveProperty('id');
        expect(cigar.name).toBe('Test Cigar');
        expect(cigar.brand_id).toBe(brandId);
      });
  });

  it('/cigars/:id (GET)', async () => {
    const cigarResponse = await request(app.getHttpServer())
      .post('/cigars')
      .send({ name: 'Test Cigar', brand_id: brandId });

    const cigar = cigarResponse.body as CigarGetDTO;
    const cigarId = cigar.id;

    return request(app.getHttpServer())
      .get(`/cigars/${cigarId}`)
      .expect(200)
      .expect((res) => {
        const fetchedCigar = res.body as CigarGetDTO;
        expect(fetchedCigar).toHaveProperty('id', cigarId);
        expect(fetchedCigar.name).toBe('Test Cigar');
        expect(fetchedCigar.brand_name).toBe('Test Brand');
      });
  });

  it('/cigars/:id (PATCH)', async () => {
    const cigarResponse = await request(app.getHttpServer())
      .post('/cigars')
      .send({ name: 'Test Cigar', brand_id: brandId });

    const cigar = cigarResponse.body as CigarGetDTO;
    const cigarId = cigar.id;

    return request(app.getHttpServer())
      .patch(`/cigars/${cigarId}`)
      .send({ name: 'Updated Cigar' })
      .expect(200)
      .expect((res) => {
        const updatedCigar = res.body as CigarGetDTO;
        expect(updatedCigar).toHaveProperty('id', cigarId);
        expect(updatedCigar.name).toBe('Updated Cigar');
        expect(updatedCigar.brand_id).toBe(brandId);
      });
  });

  it('/cigars/:id (GET) - not found', () => {
    return request(app.getHttpServer()).get('/cigars/invalid-id').expect(404);
  });
});
