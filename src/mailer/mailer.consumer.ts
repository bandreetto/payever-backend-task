import { Injectable } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { createNewUserMessage } from './mailer.logic';
import { Queue, Topic, TopicPayload } from '../messaging/contracts/enums';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { EXCHANGE } from '../messaging/contracts/consts';

@Injectable()
export class MailerConsumer {
  constructor(private readonly mailerService: MailerService) {}

  @RabbitSubscribe({
    exchange: EXCHANGE,
    routingKey: Topic.UserCreated,
    queue: Queue.GreetNewUser,
  })
  sendNewUserEmail(payload: TopicPayload[Topic.UserCreated]): Promise<void> {
    const greetMessage = createNewUserMessage(payload);
    return this.mailerService.sendMail(
      payload.email,
      'Greetings',
      greetMessage,
    );
  }
}
