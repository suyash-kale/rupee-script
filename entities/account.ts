import { Types } from 'mongoose';

export enum AccountCategory {
  // bank account
  Cash = 'CASH',
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
  // outstanding of credit card
  outstanding?: number;
}

// fields to be displayed basis on account category
export const Config: { [c in AccountCategory]: Array<keyof AccountType> } = {
  [AccountCategory.Cash]: ['balance'],
  [AccountCategory.Credit]: ['outstanding', 'bill', 'due'],
};
