import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { createTestAccount, getTestMessageUrl } from 'nodemailer';

describe('MailerService', () => {
  let service: MailerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          ignoreEnvFile: true,
          load: [
            async () => {
              const testAccount = await createTestAccount();
              return {
                SMTP_SERVER_URI: `smtp://${testAccount.user}:${testAccount.pass}@${testAccount.smtp.host}:${testAccount.smtp.port}/?secure=${testAccount.smtp.secure}`,
                MAIL_SENDER: testAccount.user,
              };
            },
          ],
        }),
      ],
      providers: [MailerService],
    }).compile();

    service = module.get<MailerService>(MailerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correclty send mail', async () => {
    await service.sendMail(
      'morpheus@matrix.com',
      'God of Dreams',
      'Or captain of Nebuchadnezzar',
    );
  });
});
