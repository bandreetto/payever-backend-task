import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from 'src/users/contracts';

@Injectable()
export class ReqresService {
  getUserById(id: number): Promise<User> {
    throw new NotImplementedException();
  }
}
