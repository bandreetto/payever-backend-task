import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { User } from './contracts';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() user: Omit<User, 'id' | 'createdAt'>,
  ): Promise<User> {
    if (!user.name) throw new BadRequestException();

    const createdUser = await this.userService.save(user);
    return createdUser;
  }
}
