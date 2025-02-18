import { AccountCategory, AccountType } from '@/entities/account';
import z from 'zod';

// post form schema definition
export const SchemaPost = z
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

// post form schema type
export type SchemaPostType = z.infer<typeof SchemaPost>;

// post form error type
export type ErrorPostType = {
  [k in keyof SchemaPostType]?: string;
};

// post form service response type
export type StatePostType = {
  errors: ErrorPostType;
  status: null | 'success' | 'error';
  message: string;
  data?: AccountType;
};
