import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class AvatarService {
  save(userId: string, avatar: Buffer): Promise<void> {
    throw new NotImplementedException();
  }

  findByUserId(userId: string): Promise<Buffer> {
    throw new NotImplementedException();
  }
}
