import type { Account } from '@/mongo/entities/account';
import { EntityType } from '@/types/entities';

export enum AccountCategory {
  // bank account
  Bank = 'CASH',
  // credit card
  Credit = 'CREDIT',
}

// account type definition
export type AccountType = EntityType<Account>;
