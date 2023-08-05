import { User } from 'src/users/contracts';

export enum Topic {
  UserCreated = 'user.created',
}

export type TopicPayload = {
  [Topic.UserCreated]: User;
};
