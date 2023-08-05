import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './contracts';
import { ReqresModule } from '../reqres/reqres.module';
import { MessagingModule } from 'src/messaging/messaging.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ReqresModule,
    MessagingModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
