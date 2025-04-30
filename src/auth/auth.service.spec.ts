import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

interface LoginResponse {
  access_token: string;
}

describe('Authentication', () => {
  let app: INestApplication;
  let accessToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      })
      .expect(201);
  });

  it('should login with registered user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    const loginResponse = response.body as LoginResponse;
    accessToken = loginResponse.access_token;
    expect(accessToken).toBeDefined();
  });

  it('should access protected route with JWT token', () => {
    return request(app.getHttpServer())
      .get('/collections')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
  });

  it('should not access protected route without JWT token', () => {
    return request(app.getHttpServer()).get('/collections').expect(401);
  });
});
 