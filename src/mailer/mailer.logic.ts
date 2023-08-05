import { User } from 'src/users/contracts';

export function createNewUserMessage(newUser: User): string {
  return `Greetings ${newUser.name},\n\nWe are happy to welcome you to our platform!\n\nPayever`;
}
