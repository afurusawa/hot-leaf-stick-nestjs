import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { setupTestApp } from './setup';
import { VitolaGetDTO } from '../src/vitolas/dto/vitola.dto';
import { CigarGetDTO } from '../src/cigars/dto/cigar.dto';
import { BrandGetDTO } from '../src/brands/dto/brand.dto';

describe('VitolaController (e2e)', () => {
  let app: INestApplication;
  let brandId: string;
  let cigarId: string;

  beforeAll(async () => {
    app = await setupTestApp();

    // Create a brand
    const brandResponse = await request(app.getHttpServer())
      .post('/brands')
      .send({ name: 'Test Brand' });
    const brand = brandResponse.body as BrandGetDTO;
    brandId = brand.id;

    // Create a cigar
    const cigarResponse = await request(app.getHttpServer())
      .post('/cigars')
      .send({ name: 'Test Cigar', brand_id: brandId });
    const cigar = cigarResponse.body as CigarGetDTO;
    cigarId = cigar.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/vitolas (GET)', () => {
    return request(app.getHttpServer())
      .get('/vitolas')
      .expect(200)
      .expect((res) => {
        const vitolas = res.body as VitolaGetDTO[];
        expect(vitolas).toEqual([]);
      });
  });

  it('/vitolas (POST)', () => {
    return request(app.getHttpServer())
      .post('/vitolas')
      .send({
        name: 'Test Vitola',
        cigar_id: cigarId,
        length: 5.5,
        ring_gauge: 50,
      })
      .expect(201)
      .expect((res) => {
        const vitola = res.body as VitolaGetDTO;
        expect(vitola).toHaveProperty('id');
        expect(vitola.name).toBe('Test Vitola');
        expect(vitola.cigar_id).toBe(cigarId);
        expect(vitola.length).toBe(5.5);
        expect(vitola.ring_gauge).toBe(50);
      });
  });

  it('/vitolas/:id (GET)', async () => {
    const vitolaResponse = await request(app.getHttpServer())
      .post('/vitolas')
      .send({
        name: 'Test Vitola',
        cigar_id: cigarId,
        length: 5.5,
        ring_gauge: 50,
      });

    const vitola = vitolaResponse.body as VitolaGetDTO;
    const vitolaId = vitola.id;

    return request(app.getHttpServer())
      .get(`/vitolas/${vitolaId}`)
      .expect(200)
      .expect((res) => {
        const fetchedVitola = res.body as VitolaGetDTO;
        expect(fetchedVitola).toHaveProperty('id', vitolaId);
        expect(fetchedVitola.name).toBe('Test Vitola');
        expect(fetchedVitola.cigar_id).toBe(cigarId);
        expect(fetchedVitola.length).toBe(5.5);
        expect(fetchedVitola.ring_gauge).toBe(50);
      });
  });

  it('/vitolas/:id (PUT)', async () => {
    const vitolaResponse = await request(app.getHttpServer())
      .post('/vitolas')
      .send({
        name: 'Test Vitola',
        cigar_id: cigarId,
        length: 5.5,
        ring_gauge: 50,
      });

    const vitola = vitolaResponse.body as VitolaGetDTO;
    const vitolaId = vitola.id;

    return request(app.getHttpServer())
      .put(`/vitolas/${vitolaId}`)
      .send({
        name: 'Updated Vitola',
        cigar_id: cigarId,
        length: 6.0,
        ring_gauge: 52,
      })
      .expect(200)
      .expect((res) => {
        const updatedVitola = res.body as VitolaGetDTO;
        expect(updatedVitola).toHaveProperty('id', vitolaId);
        expect(updatedVitola.name).toBe('Updated Vitola');
        expect(updatedVitola.cigar_id).toBe(cigarId);
        expect(updatedVitola.length).toBe(6.0);
        expect(updatedVitola.ring_gauge).toBe(52);
      });
  });

  it('/vitolas/:id (DELETE)', async () => {
    const vitolaResponse = await request(app.getHttpServer())
      .post('/vitolas')
      .send({
        name: 'Test Vitola',
        cigar_id: cigarId,
        length: 5.5,
        ring_gauge: 50,
      });

    const vitola = vitolaResponse.body as VitolaGetDTO;
    const vitolaId = vitola.id;

    await request(app.getHttpServer())
      .delete(`/vitolas/${vitolaId}`)
      .expect(200);

    return request(app.getHttpServer()).get(`/vitolas/${vitolaId}`).expect(404);
  });

  it('/vitolas (POST) - duplicate name', async () => {
    await request(app.getHttpServer()).post('/vitolas').send({
      name: 'Duplicate Vitola',
      cigar_id: cigarId,
      length: 5.5,
      ring_gauge: 50,
    });

    return request(app.getHttpServer())
      .post('/vitolas')
      .send({
        name: 'Duplicate Vitola',
        cigar_id: cigarId,
        length: 5.5,
        ring_gauge: 50,
      })
      .expect(400);
  });

  it('/vitolas (POST) - duplicate dimensions', async () => {
    await request(app.getHttpServer()).post('/vitolas').send({
      name: 'Test Vitola 1',
      cigar_id: cigarId,
      length: 5.5,
      ring_gauge: 50,
    });

    return request(app.getHttpServer())
      .post('/vitolas')
      .send({
        name: 'Test Vitola 2',
        cigar_id: cigarId,
        length: 5.5,
        ring_gauge: 50,
      })
      .expect(400);
  });

  it('/vitolas/:id (GET) - not found', () => {
    return request(app.getHttpServer()).get('/vitolas/invalid-id').expect(404);
  });
});
