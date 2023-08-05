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

  async findByUserId(userId: string): Promise<Buffer> {
    let done: () => void;
    let fail: (err: Error) => void;
    const downloadPromise = new Promise<void>((resolve, reject) => {
      done = resolve;
      fail = reject;
    });
    try {
      const readStream = this.avatarBucket.openDownloadStream(
        new mongoose.Types.ObjectId(userId),
      );
      const chunks: Buffer[] = [];
      readStream.on('data', (data) => chunks.push(data));
      readStream.on('end', () => done());
      readStream.on('error', (err) => fail(err));
      await downloadPromise;
      return Buffer.concat(chunks);
    } catch (err) {
      if (
        err instanceof mongoose.mongo.MongoRuntimeError &&
        err.message.includes('FileNotFound')
      ) {
        return null;
      }
      throw err;
    }
  }

  async deleteByUserId(userId: string): Promise<void> {
    return this.avatarBucket.delete(new mongoose.Types.ObjectId(userId));
  }
}
