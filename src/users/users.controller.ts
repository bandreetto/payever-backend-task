import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { GetUserParams, User } from './contracts';
import { UsersService } from './users.service';
import { ReqresService } from '../reqres/reqres.service';
import { MessagingService } from '../messaging/messaging.service';
import { Topic } from '../messaging/contracts/enums';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarService } from './avatar/avatar.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly reqresService: ReqresService,
    private readonly messagingService: MessagingService,
    private readonly avatarService: AvatarService,
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

  @Post(':id/avatar')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar'))
  uploadAvatar(
    @Param() params: GetUserParams,
    @UploadedFile() avatar: Express.Multer.File,
  ): Promise<void> {
    return this.avatarService.save(params.id, avatar.buffer);
  }

  @Get(':id/avatar')
  @HttpCode(HttpStatus.OK)
  async getAvatar(@Param() params: GetUserParams): Promise<string> {
    const avatar = await this.avatarService.findByUserId(params.id);
    if (!avatar) {
      throw new NotFoundException();
    }
    return avatar.toString('base64');
  }

  @Delete(':id/avatar')
  @HttpCode(HttpStatus.OK)
  async deleteAvatar(@Param() params: GetUserParams): Promise<void> {
    return this.avatarService.deleteByUserId(params.id);
  }
}
