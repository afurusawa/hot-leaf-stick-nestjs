import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './setup';
import { BrandGetDTO } from '../src/brands/dto/brand.dto';

describe('BrandController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await setupTestApp();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/brands (GET)', () => {
    return request(app.getHttpServer())
      .get('/brands')
      .expect(200)
      .expect((res) => {
        const brands = res.body as BrandGetDTO[];
        expect(brands).toEqual([]);
      });
  });

  it('/brands (POST)', () => {
    return request(app.getHttpServer())
      .post('/brands')
      .send({ name: 'Test Brand', site_url: 'https://www.testbrand.com' })
      .expect(200)
      .expect((res) => {
        const brand = res.body as BrandGetDTO;
        expect(brand).toHaveProperty('id');
        expect(brand.name).toBe('Test Brand');
        expect(brand.site_url).toBe('https://www.testbrand.com');
      });
  });

  it('/brands/:id (PATCH)', async () => {
    const brandResponse = await request(app.getHttpServer())
      .post('/brands')
      .send({ name: 'Test Brand', site_url: 'https://www.testbrand.com' });

    const brand = brandResponse.body as BrandGetDTO;
    const brandId = brand.id;

    return request(app.getHttpServer())
      .patch(`/brands/${brandId}`)
      .send({ name: 'Updated Brand' })
      .expect(200)
      .expect((res) => {
        const updatedBrand = res.body as BrandGetDTO;
        expect(updatedBrand).toHaveProperty('id', brandId);
        expect(updatedBrand.name).toBe('Updated Brand');
        expect(updatedBrand.site_url).toBe('https://www.testbrand.com');
      });
  });
});
