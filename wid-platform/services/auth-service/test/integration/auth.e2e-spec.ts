
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { AuthError } from '@wid-platform/contracts';

describe('AuthService (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/register (POST) - should register a user', async () => {
    const email = `test-register-${Date.now()}@example.com`;
    const password = 'Password123!';

    const res = await request(app.getHttpServer())
      .post('/api/auth/register') // Using global prefix
      .send({ email, password })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('/auth/register (POST) - should not register with existing email', async () => {
    const email = `test-existing-${Date.now()}@example.com`;
    const password = 'Password123!';

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(400); // Bad Request for validation failure

    // You might want to assert specific error message if exposed by validation pipe
    // For now, checking the status code and a generic message.
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Validation failed');
  });


  it('/auth/login (POST) - should login a registered user', async () => {
    const email = `test-login-${Date.now()}@example.com`;
    const password = 'Password123!';

    // First register the user
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    // Then try to login
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
    expect(typeof res.body.accessToken).toBe('string');
  });

  it('/auth/login (POST) - should not login with invalid credentials', async () => {
    const email = `test-invalid-${Date.now()}@example.com`;
    const password = 'Password123!';

    // First register a user
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(201);

    // Then try to login with wrong password
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'WrongPassword' })
      .expect(401);

    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toEqual('Unauthorized');
  });
});
