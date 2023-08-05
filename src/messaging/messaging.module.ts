import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MessagingService } from './messaging.service';
import { EXCHANGE } from './contracts/consts';

@Module({
  imports: [
    RabbitMQModule.forRootAsync(RabbitMQModule, {
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          exchanges: [
            {
              name: EXCHANGE,
              type: 'topic',
            },
          ],
          uri: configService.get('RABBITMQ_URI'),
        };
      },
    }),
  ],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
