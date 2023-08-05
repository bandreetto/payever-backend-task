import { Test, TestingModule } from '@nestjs/testing';
import { MessagingService } from './messaging.service';
import { Topic } from './contracts/enums';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { User } from 'src/users/contracts';
import { EXCHANGE } from './contracts/consts';

describe('MessagingService', () => {
  let service: MessagingService;
  const publish = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagingService,
        {
          provide: AmqpConnection,
          useValue: {
            publish,
          },
        },
      ],
    }).compile();

    service = module.get<MessagingService>(MessagingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly publish to amqp connection', () => {
    const user: User = {
      id: '1',
      name: 'Morpheus',
      email: 'morpheus@matrix.com',
      job: 'leader',
      createdAt: new Date(),
    };
    service.publish(Topic.UserCreated, user);
    expect(publish).toHaveBeenCalledWith(EXCHANGE, Topic.UserCreated, user);
  });
});
