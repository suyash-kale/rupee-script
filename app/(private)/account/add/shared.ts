import { AccountCategory, AccountType } from '@/entities/account';
import z from 'zod';

// form schema definition
export const Schema = z
  .object({
    title: z.string().min(2).max(50),
    category: z.nativeEnum(AccountCategory),
    balance: z.string().regex(/^\d+$/).transform(Number).or(z.number()),
    bill: z
      .string()
      .min(0)
      .max(31)
      .regex(/^\d+$/)
      .transform(Number)
      .or(z.number())
      .optional(),
    due: z
      .string()
      .min(0)
      .max(31)
      .regex(/^\d+$/)
      .transform(Number)
      .or(z.number())
      .optional(),
  })
  .refine(
    (data) => {
      // making sure bill in required for credit category
      if (data.category === AccountCategory.Credit && !data.bill) {
        return false;
      }
      return true;
    },
    {
      path: ['bill'],
      message: 'Required',
    },
  )
  .refine(
    (data) => {
      // making sure due in required for credit category
      if (data.category === AccountCategory.Credit && !data.due) {
        return false;
      }
      return true;
    },
    {
      path: ['due'],
      message: 'Required',
    },
  );

// form schema type
export type SchemaType = z.infer<typeof Schema>;

// form error type
export type ErrorType = {
  [k in keyof SchemaType]?: string;
};

// form service response type
export type StateType = {
  errors: ErrorType;
  status: null | 'success' | 'error';
  message: string;
  data?: AccountType;
};
