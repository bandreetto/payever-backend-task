import { Injectable } from '@nestjs/common';
import { Topic, TopicPayload } from './contracts/enums';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGE } from './contracts/consts';

@Injectable()
export class MessagingService {
  constructor(private readonly connection: AmqpConnection) {}

  publish<T extends Topic>(topic: T, payload: TopicPayload[T]): Promise<void> {
    return this.connection.publish(EXCHANGE, topic, payload);
  }
}
