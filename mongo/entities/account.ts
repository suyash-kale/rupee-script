import mongoose, { model, Schema } from 'mongoose';

import { AccountType, AccountCategory } from '@/entities/account';

const AccountSchema = new Schema<AccountType>({
  // user ref
  user: { ref: 'User', type: Schema.Types.ObjectId, required: true },
  // category of account
  category: { type: String, required: true, enum: AccountCategory },
  title: { type: String, required: true },
  // balance of cash account
  balance: { type: Number },
  // credit card billing date
  bill: { type: Number },
  // credit card due date
  due: { type: Number },
});

export default mongoose.models.Account ||
  model<AccountType>('Account', AccountSchema);
