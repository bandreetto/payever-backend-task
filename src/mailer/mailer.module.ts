import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerConsumer } from './mailer.consumer';

@Module({
  providers: [MailerService, MailerConsumer],
})
export class MailerModule {}
