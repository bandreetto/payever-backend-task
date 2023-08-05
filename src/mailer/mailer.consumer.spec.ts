import { Test, TestingModule } from '@nestjs/testing';
import { MailerConsumer } from './mailer.consumer';
import { User } from 'src/users/contracts';
import { MailerService } from './mailer.service';
import { createNewUserMessage } from './mailer.logic';

describe('MailerConsumer', () => {
  let consumer: MailerConsumer;
  const sendNewUserEmail = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerConsumer,
        {
          provide: MailerService,
          useValue: {
            sendNewUserEmail,
          },
        },
      ],
    }).compile();

    consumer = module.get<MailerConsumer>(MailerConsumer);
  });

  it('should be defined', () => {
    expect(consumer).toBeDefined();
  });

  it('should correctly consume new user message', async () => {
    const user: User = {
      id: '1',
      name: 'Morpheus',
      email: 'morpheus@matrix.com',
      job: 'leader',
      createdAt: new Date(),
    };
    await consumer.sendNewUserEmail(user);
    expect(sendNewUserEmail).toHaveBeenCalledWith(
      user.email,
      createNewUserMessage(user),
    );
  });
});
