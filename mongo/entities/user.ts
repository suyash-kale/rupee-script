import mongoose from 'mongoose';
import { prop, getModelForClass } from '@typegoose/typegoose';

export class User {
  @prop({ required: true })
  public name: string;

  @prop({ required: true })
  public email: string;

  @prop()
  public image?: null | string;
}

export default mongoose.models.User || getModelForClass(User);
