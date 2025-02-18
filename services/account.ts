'use server';

import z from 'zod';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import connect from '@/mongo/connect';
import Account from '@/mongo/entities/account';
import { AccountCategory, AccountType } from '@/entities/account';
import {
  SchemaPost,
  SchemaPostType,
  StatePostType,
} from '@/app/(private)/account/add/shared-post';
import {
  SchemaPut,
  SchemaPutType,
  StatePutType,
} from '@/app/(private)/account/[id]/shared-put';
import {
  SchemaDelete,
  SchemaDeleteType,
  StateDeleteType,
} from '@/app/(private)/account/[id]/shared-delete';

// post account service
// adding account to database
export const POST = async (data: SchemaPostType): Promise<StatePostType> => {
  await connect();
  try {
    // validating form data
    await SchemaPost.parseAsync(data);
    // checking if account with same title already exists
    const exists = await Account.findOne({ title: data.title });
    if (exists) {
      return {
        status: 'error',
        message: 'Account with this Title already exists.',
        errors: {
          title: 'Title already exists.',
        },
      };
    }
    // getting current user session
    const session = await auth();
    if (session?.user) {
      // creating account and saving to database
      const account = await Account.create({ ...data, user: session?.user.id });
      await account.save();
      return {
        data: account,
        status: 'success',
        message: 'Account added Successfully.',
        errors: {},
      };
    } else {
      throw new Error('Authentication failed.');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // handling zod validation errors
      return {
        status: 'error',
        message: 'Data validation failed.',
        errors: error.flatten().fieldErrors,
      };
    } else if (error instanceof Error) {
      // handling thrown errors
      return {
        status: 'error',
        message: error.message,
        errors: {},
      };
    }
    // handling unexpected errors
    return {
      status: 'error',
      message: 'Unexpected error occurred.',
      errors: {},
    };
  }
};

// get list of accounts service
export const GET = async (): Promise<undefined | Array<AccountType>> => {
  await connect();
  const account = await Account.find({
    // getting only undeleted accounts
    $or: [{ deleted: { $exists: false } }, { deleted: false }],
  });
  return account ? JSON.parse(JSON.stringify(account)) : undefined;
};

// get account detail service
export const DETAIL = async (
  _id: AccountType['_id'],
): Promise<undefined | null | AccountType> => {
  await connect();
  const account = await Account.findOne({
    // getting only undeleted accounts
    $or: [{ deleted: { $exists: false } }, { deleted: false }],
    // getting account by id
    $and: [{ _id }],
  });
  return account ? JSON.parse(JSON.stringify(account)) : undefined;
};

// put account service
export const PUT = async (data: SchemaPutType): Promise<StatePutType> => {
  await connect();
  try {
    // validating form data
    await SchemaPut.parseAsync(data);
    // making sure account exists
    const account = await Account.findById(data._id);
    if (!account) {
      return {
        status: 'error',
        message: 'Account does not exists.',
        errors: {},
      };
    }
    // getting current user session
    const session = await auth();
    if (session?.user) {
      // saving updated values to database
      account.title = data.title;
      if (account.category === AccountCategory.Credit) {
        account.bill = data.bill;
        account.due = data.due;
      }
      await account.save();
      // revalidating the account detail and account list page
      revalidatePath(`/account/${data._id}`);
      revalidatePath('/account');
      return {
        data: JSON.parse(JSON.stringify(account)),
        status: 'success',
        message: 'Account updated Successfully.',
        errors: {},
      };
    } else {
      throw new Error('Authentication failed.');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // handling zod validation errors
      return {
        status: 'error',
        message: 'Data validation failed.',
        errors: error.flatten().fieldErrors,
      };
    } else if (error instanceof Error) {
      // handling thrown errors
      return {
        status: 'error',
        message: error.message,
        errors: {},
      };
    }
    // handling unexpected errors
    return {
      status: 'error',
      message: 'Unexpected error occurred.',
      errors: {},
    };
  }
};

// delete account service
export const DELETE = async (
  data: SchemaDeleteType,
): Promise<StateDeleteType> => {
  await connect();
  try {
    // validating form data
    await SchemaDelete.parseAsync(data);
    // making sure account exists
    const account = await Account.findById(data._id);
    if (!account) {
      return {
        status: 'error',
        message: 'Account does not exists.',
      };
    }
    // getting current user session
    const session = await auth();
    if (session?.user) {
      // updating account deletion status
      account.deleted = true;
      await account.save();
      revalidatePath('/account');
      return {
        status: 'success',
        message: 'Account deleted Successfully.',
      };
    } else {
      throw new Error('Authentication failed.');
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      // handling zod validation errors
      return {
        status: 'error',
        message: 'Data validation failed.',
      };
    } else if (error instanceof Error) {
      // handling thrown errors
      return {
        status: 'error',
        message: error.message,
      };
    }
    // handling unexpected errors
    return {
      status: 'error',
      message: 'Unexpected error occurred.',
    };
  }
};
