import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class MailerService {
  sendMail(to: string, body: string): Promise<void> {
    throw new NotImplementedException();
  }
}
