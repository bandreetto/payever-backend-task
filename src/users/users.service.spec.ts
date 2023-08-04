import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User, UserSchema } from './contracts';
import mongoose from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;
  let mongoServer: MongoMemoryServer;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongoServer = await MongoMemoryServer.create();
            return {
              uri: mongoServer.getUri(),
            };
          },
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
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

  afterAll(async () => {
    await mongoose.connection.close();
    await mongoose.disconnect();
    await mongoServer.stop();
  });
});
