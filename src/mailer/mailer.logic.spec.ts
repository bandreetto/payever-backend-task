import { User } from 'src/users/contracts';
import { createNewUserMessage } from './mailer.logic';

describe('MailerLogic', () => {
  it('should correclty generate greetings message for new user', () => {
    const user: User = {
      id: '1',
      name: 'Morpheus',
      email: 'morpheus@matrix.com',
      job: 'leader',
      createdAt: new Date(),
    };
    const message = createNewUserMessage(user);
    expect(message).toBe(
      'Greetings Morpheus,\n\nWe are happy to welcome you to our platform!\n\nPayever',
    );
  });
});
