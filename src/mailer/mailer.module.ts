import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerConsumer } from './mailer.consumer';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [MailerService, MailerConsumer],
})
export class MailerModule {}
