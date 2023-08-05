import { Test, TestingModule } from '@nestjs/testing';
import { AvatarService } from './avatar.service';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule } from '@nestjs/mongoose';
import { readFile } from 'fs';
import mongoose from 'mongoose';

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
    const userId = new mongoose.Types.ObjectId().toString();
    await service.save(userId, avatar);
    const savedAvatar = await service.findByUserId(userId);
    expect(savedAvatar).toEqual(avatar);
  });

  it('should correctly delete an avatar from the db', async () => {
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
    const userId = new mongoose.Types.ObjectId().toString();
    await service.save(userId, avatar);
    await service.deleteByUserId(userId);
    const deletedAvatar = await service.findByUserId(userId);
    expect(deletedAvatar).toBe(null);
  });
});
