import mongoose from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';

import { User } from '@/mongo/entities/user';
import { AccountCategory } from '@/entities/account';

export class Account {
  @prop({ ref: () => User, required: true })
  public user: Ref<User>;

  @prop({ required: true, enum: AccountCategory, type: String })
  public category: AccountCategory;

  @prop({ required: true })
  public title: string;

  @prop()
  public balance: number;

  @prop()
  public bill?: number;

  @prop()
  public due?: number;

  @prop()
  public deleted?: boolean;
}

export default mongoose.models.Account || getModelForClass(Account);
