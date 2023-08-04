import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from './contracts';

@Injectable()
export class UsersService {
  save(userFields: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    throw new NotImplementedException();
  }

  findById(id: User['id']): Promise<User> {
    throw new NotImplementedException();
  }
}
