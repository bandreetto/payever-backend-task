import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { User } from 'src/users/contracts';

@Injectable()
export class ReqresService {
  constructor(private readonly httpService: HttpService) {}

  async getUserById(id: number): Promise<User> {
    const response = await firstValueFrom(this.httpService.get(`/users/${id}`));
    return {
      ...response.data.data,
      id: response.data.data.id.toString(),
    };
  }
}
