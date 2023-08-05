import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Transporter, createTransport } from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter: Transporter;

  constructor(private readonly configService: ConfigService) {
    const url = new URL(configService.get('SMTP_SERVER_URI'));

    const config = {
      host: url.hostname,
      port: url.port,
      secure: url.searchParams.get('secure') === 'true',
      auth: {
        user: decodeURIComponent(url.username),
        pass: decodeURIComponent(url.password),
      },
    };

    this.transporter = createTransport(config as any);
  }

  sendMail(to: string, subject: string, body: string): Promise<void> {
    return this.transporter.sendMail({
      from: this.configService.get('MAIL_SENDER'),
      to,
      subject,
      text: body,
    });
  }
}
