import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { GetUserParams, User } from './contracts';
import { UsersService } from './users.service';
import { ReqresService } from '../reqres/reqres.service';
import { MessagingService } from '../messaging/messaging.service';
import { Topic } from '../messaging/contracts/enums';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly reqresService: ReqresService,
    private readonly messagingService: MessagingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() user: Omit<User, 'id'>): Promise<User> {
    if (!user.name) throw new BadRequestException();
    if (!user.email) throw new BadRequestException();

    const createdUser = await this.userService.save(user);

    this.messagingService.publish(Topic.UserCreated, createdUser);

    return createdUser;
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param() params: GetUserParams): Promise<User> {
    return this.reqresService.getUserById(params.id);
  }
}
