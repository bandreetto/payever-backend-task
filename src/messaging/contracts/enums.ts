import { User } from 'src/users/contracts';

export enum Topic {
  UserCreated = 'user.created',
}

export type TopicPayload = {
  [Topic.UserCreated]: User;
};

export enum Queue {
  GreetNewUser = 'user:greetNewUser',
}
