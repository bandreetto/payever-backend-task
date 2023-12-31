import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { MailerService } from '../src/mailer/mailer.service';

describe('Mailer (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  it('should send an email after creating a user', async () => {
    const mailerService = app.get(MailerService);
    const sendMailFn = jest.fn();
    mailerService.sendMail = sendMailFn;

    const user = {
      name: 'morpheus',
      email: 'morpheus@matrix.com',
      job: 'leader',
    };

    await request(app.getHttpServer())
      .post('/api/users')
      .send(user)
      .expect(201);

    // wait for message consumption
    await new Promise((resolve) => setTimeout(resolve, 1000));

    expect(sendMailFn).toBeCalled();
  });

  afterAll(async () => {
    await app.close();
  });
});
