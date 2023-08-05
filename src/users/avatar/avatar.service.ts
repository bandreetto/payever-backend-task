import { Injectable, NotImplementedException } from '@nestjs/common';
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

  async findByUserId(userId: string): Promise<Buffer> {
    let done: () => void;
    const downloadPromise = new Promise<void>((resolve) => (done = resolve));
    const readStream = this.avatarBucket.openDownloadStream(
      new mongoose.Types.ObjectId(userId),
    );
    const chunks: Buffer[] = [];
    readStream.on('end', () => done());
    readStream.on('data', (data) => chunks.push(data));
    await downloadPromise;
    return Buffer.concat(chunks);
  }

  async deleteByUserId(userId: string): Promise<void> {
    throw new NotImplementedException();
  }
}
