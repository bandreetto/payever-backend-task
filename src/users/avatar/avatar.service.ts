import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import mongoose, { Connection } from 'mongoose';

@Injectable()
export class AvatarService {
  private avatarBucket: mongoose.mongo.GridFSBucket;

  constructor(@InjectConnection() connection: Connection) {
    this.avatarBucket = new mongoose.mongo.GridFSBucket(connection.db, {
      bucketName: 'avatar',
    });
  }

  save(userId: string, avatar: Buffer): Promise<void> {
    let done: () => void;
    const uploadPromise = new Promise<void>((resolve) => (done = resolve));
    const writeStream = this.avatarBucket.openUploadStreamWithId(
      new mongoose.Types.ObjectId(userId),
      `${userId}.jpg`,
    );
    writeStream.on('finish', () => {
      done();
    });
    writeStream.end(avatar);
    return uploadPromise;
  }

  findByUserId(userId: string): Promise<Buffer> {
    let done: (avatar: Buffer) => void;
    const downloadPromise = new Promise<Buffer>((resolve) => (done = resolve));
    const readStream = this.avatarBucket.openDownloadStream(
      new mongoose.Types.ObjectId(userId),
    );
    readStream.on('data', (data) => done(data));
    return downloadPromise;
  }
}
