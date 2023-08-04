import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: { createdAt: true } })
export class User {
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  job?: string;

  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
