import { Injectable, NotImplementedException } from '@nestjs/common';
import { User } from './contracts';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async save(userFields: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user = await this.userModel.create(userFields);
    return {
      id: user._id.toString(),
      ...user.toObject(),
    };
  }

  async findById(id: User['id']): Promise<User> {
    const user = await this.userModel.findById(id).lean();
    return {
      id: user._id.toString(),
      ...user,
    };
  }
}
