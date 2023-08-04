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
    await app.init();
  });

  it('/api/users (POST)', async () => {
    const user = {
      name: 'morpheus',
      job: 'leader',
    };

    const response = await request(app.getHttpServer())
      .post('/api/users')
      .send(user)
      .expect(201);

    expect(typeof response.body.id).toBe('number');
    expect(response.body.name).toBe('morpheus');
    expect(response.body.job).toBe('leader');
    expect(response.body.createdAt).toBeInstanceOf(Date);
  });
});
