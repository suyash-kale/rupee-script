'use server';

import z from 'zod';
import { revalidatePath } from 'next/cache';

import { auth } from '@/auth';
import connect from '@/mongo/connect';
import Account from '@/mongo/entities/account';
import { AccountCategory, AccountType } from '@/entities/account';
import { StateType } from '@/types/response';
import {
  SchemaPost,
  SchemaPostType,
  SchemaPut,
  SchemaPutType,
  SchemaDelete,
  SchemaDeleteType,
} from '@/services/account/shared';
import { plain } from '@/util/json';

// post account service
// adding account to database
export const POST = async (
  data: SchemaPostType,
): Promise<StateType<AccountType>> => {
  await connect();
  try {
    // validating form data
    await SchemaPost.parseAsync(data);
    // getting current user session
    const session = await auth();
    if (session?.user) {
      // checking if account with same title already exists
      const exists = await Account.findOne({
        title: { $regex: new RegExp(`^${data.title}$`, 'i') },
        user: session?.user.id,
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      }).select('_id');
      if (exists) {
        return {
          status: 'error',
          message: 'Account with this Title already exists.',
          errors: {
            title: ['Title already exists.'],
          },
        };
      }
      // creating account and saving to database
      const account = await Account.create({ ...data, user: session?.user.id });
      await account.save();
      revalidatePath('/account');
      return {
        data: plain(account),
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
  const session = await auth();
  if (session?.user) {
    const account = await Account.find({
      user: session?.user.id,
      // getting only undeleted accounts
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
    }).select('_id title category balance bill due');
    return account;
  } else {
    throw new Error('Authentication failed.');
  }
};

// get account detail service
export const DETAIL = async (
  _id: AccountType['_id'],
): Promise<undefined | null | AccountType> => {
  await connect();
  const session = await auth();
  if (session?.user) {
    const account = await Account.findOne({
      user: session?.user.id,
      // getting only undeleted accounts
      $or: [{ deleted: { $exists: false } }, { deleted: false }],
      // getting account by id
      $and: [{ _id }],
    }).select('_id title category balance bill due');
    return plain(account);
  } else {
    throw new Error('Authentication failed.');
  }
};

// put account service
export const PUT = async (
  data: SchemaPutType,
): Promise<StateType<AccountType>> => {
  await connect();
  try {
    // validating form data
    await SchemaPut.parseAsync(data);
    // getting current user session
    const session = await auth();
    if (session?.user) {
      // making sure account exists
      const account = await Account.findOne({
        _id: data._id,
        user: session?.user.id,
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      }).select('_id title category balance bill due');
      if (!account) {
        return {
          status: 'error',
          message: 'Account does not exists.',
          errors: {},
        };
      }
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
        data: plain(account),
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
): Promise<StateType<AccountType>> => {
  await connect();
  try {
    // validating form data
    await SchemaDelete.parseAsync(data);
    // getting current user session
    const session = await auth();
    if (session?.user) {
      // making sure account exists
      const account = await Account.findOne({
        _id: data._id,
        user: session?.user.id,
        $or: [{ deleted: { $exists: false } }, { deleted: false }],
      });
      if (!account) {
        return {
          status: 'error',
          message: 'Account does not exists.',
        };
      }
      // updating account deletion status
      account.deleted = true;
      await account.save();
      setTimeout(() => revalidatePath('/account'), 0);
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
