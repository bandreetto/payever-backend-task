import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ReqresModule } from './reqres/reqres.module';
import { MailerModule } from './mailer/mailer.module';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

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
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      useFactory: (configService: ConfigService) => {
        return {
          exchanges: [
            {
              name: 'payever',
              type: 'topic',
            },
          ],
          uri: configService.get('RABBITMQ_URI'),
        };
      },
    }),
    ReqresModule,
    MailerModule,
  ],
})
export class AppModule {}
