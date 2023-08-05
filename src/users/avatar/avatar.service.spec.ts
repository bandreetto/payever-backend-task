import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { readFile } from 'fs';

describe('AvatarService', () => {
  let service: AvatarService;
  let mongoServer: MongoMemoryServer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongoServer = await MongoMemoryServer.create();
            return {
              uri: mongoServer.getUri(),
            };
          },
        }),
      ],
      providers: [AvatarService],
    }).compile();

    service = module.get<AvatarService>(AvatarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly save an avatar to the db', async () => {
    let resolveAvatar: (avatar: Buffer) => void;
    const avatarPromise = new Promise<Buffer>(
      (resolve) => (resolveAvatar = resolve),
    );
    readFile(
      __dirname + '/../../../test/resources/NeoTheMatrix.jpg',
      async (err, data) => {
        if (err) throw err;

        resolveAvatar(data);
      },
    );
    const avatar = await avatarPromise;
    await service.save('user-id', avatar);
    const savedAvatar = await service.findByUserId('user-id');
    expect(savedAvatar).toEqual(avatar);
  });
});
