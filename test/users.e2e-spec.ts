import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Users Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('/api/users (POST)', async () => {
    const user = {
      name: 'morpheus',
      email: 'morpheus@matrix.com',
      job: 'leader',
    };

    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send(user)
      .expect(201);

    expect(typeof response.body.id).toBe('string');
    expect(response.body.name).toBe('morpheus');
    expect(response.body.job).toBe('leader');
    expect(Date.parse(response.body.createdAt)).not.toBeNaN();
  });

  it('/api/users/:id (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/users/1')
      .expect(200);

    expect(response.body.id).toBe('1');
  });

  afterAll(async () => {
    await app.close();
  });
});
