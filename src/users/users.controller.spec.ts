import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
});
