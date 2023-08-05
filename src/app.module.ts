import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReqresModule } from './reqres/reqres.module';
import { MailerModule } from './mailer/mailer.module';
import { MessagingModule } from './messaging/messaging.module';
import { AvatarService } from './user/avatar/avatar.service';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.test.env' : '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: configService.get('MONGO_URI'),
        };
      },
    }),
    ReqresModule,
    MailerModule,
    MessagingModule,
  ],
})
export class AppModule {}
