import { Types } from 'mongoose';

export enum AccountCategory {
  // bank account
  Bank = 'CASH',
  // credit card
  Credit = 'CREDIT',
}

// account type definition
export interface AccountType {
  // user ref
  user: Types.ObjectId;
  // category of account
  category: AccountCategory;
  title: string;
  // balance of cash account
  balance?: number;
  // credit card billing date
  bill?: number;
  // credit card due date
  due?: number;
}
