import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correclty save a user', async () => {
    const user = {
      name: 'morpheus',
      job: 'leader',
    };

    const created = await service.save(user);
    const retrieved = await service.findById(created.id);

    expect(created.name).toBe(user.name);
    expect(created.job).toBe(user.job);
    expect(created).toEqual(retrieved);
  });
});
