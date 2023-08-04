import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotImplementedException,
  Post,
} from '@nestjs/common';
import { User } from './contracts';

@Controller('users')
export class UsersController {
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    throw new NotImplementedException();
  }
}
