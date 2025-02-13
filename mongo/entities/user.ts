import mongoose, { model, Schema } from 'mongoose';

import { UserType } from '@/entities/user';

const UserSchema = new Schema<UserType>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  picture: String,
});

export default mongoose.models.User || model<UserType>('User', UserSchema);
