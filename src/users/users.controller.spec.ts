import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BadRequestException } from '@nestjs/common';
import { User } from './contracts';
import { ReqresService } from '../reqres/reqres.service';
import { Topic } from '../messaging/contracts/enums';
import { MessagingService } from '../messaging/messaging.service';
import { AvatarService } from './avatar/avatar.service';

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
          provide: MessagingService,
          useValue: {
            publish,
          },
        },
        { provide: AvatarService, useValue: {} },
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
      email: 'morpheus@matrix.com',
      job: 'leader',
    };
    const result = await controller.createUser(user);
    expect(typeof result.id).toBe('number');
    expect(result.name).toBe(user.name);
    expect(result.job).toBe(user.job);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it('should fail to create on missing required values', () => {
    expect(() =>
      controller.createUser({ email: 'morpheus@matric.com' } as any),
    ).rejects.toThrow(BadRequestException);
    expect(() =>
      controller.createUser({ name: 'morpheus' } as any),
    ).rejects.toThrow(BadRequestException);
  });

  it('should correctly get a user by id', async () => {
    const user = await controller.getUserById({ id: '1' });
    expect(user.id).toBe('1');
  });

  it('should publish user created message after creating a user', async () => {
    const user = {
      name: 'morpheus',
      email: 'morpheus@matrix.com',
      job: 'leader',
    };
    const createdUser = await controller.createUser(user);
    expect(publish).toHaveBeenCalledWith(Topic.UserCreated, createdUser);
  });
});
