import { Types } from 'mongoose';

export enum AccountCategory {
  // bank account
  Bank = 'CASH',
  // credit card
  Credit = 'CREDIT',
}

// account type definition
export interface AccountType {
  _id: string;
  // user ref
  user: Types.ObjectId;
  title: string;
  // category of account
  category: AccountCategory;
  // balance of cash account
  balance?: number;
  // credit card billing date
  bill?: number;
  // credit card due date
  due?: number;
  // account deletion status
  deleted: boolean;
}
