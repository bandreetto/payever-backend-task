import { Injectable, NotImplementedException } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { User } from 'src/users/contracts';

@Injectable()
export class MailerConsumer {
  constructor(private readonly mailerService: MailerService) {}

  sendNewUserEmail(payload: User): Promise<void> {
    throw new NotImplementedException();
  }
}
