import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { User } from './contracts';
import { ReqresService } from '../reqres/reqres.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { UserEvents } from './contracts/enums';

describe('UsersController', () => {
  let controller: UsersController;
  const publish = jest.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: {
            save(user: User) {
              return {
                id: 1,
                createdAt: new Date(),
                ...user,
              };
            },
          },
        },
        {
          provide: ReqresService,
          useValue: {
            getUserById(id: number) {
              return {
                id,
                name: 'John',
                job: 'Doe',
                createdAt: new Date(),
              };
            },
          },
        },
        {
          provide: AmqpConnection,
          useValue: {
            publish,
          },
        },
      ],
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should correclty create a user', async () => {
    const user = {
      name: 'morpheus',
      job: 'leader',
    };
    const result = await controller.createUser(user);
    expect(typeof result.id).toBe('number');
    expect(result.name).toBe(user.name);
    expect(result.job).toBe(user.job);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should fail to create on missing required values', () => {
    expect(() => controller.createUser({ name: '' })).rejects.toThrow(
      BadRequestException,
    );
  });

  it('should correctly get a user by id', async () => {
    const user = await controller.getUserById({ id: 1 });
    expect(user.id).toBe(1);
  });

  it('should publish user created message after creating a user', async () => {
    const user = {
      name: 'morpheus',
      job: 'leader',
    };
    const createdUser = await controller.createUser(user);
    expect(publish).toHaveBeenCalledWith(
      'payever',
      UserEvents.UserCreated,
      createdUser,
    );
  });
});
